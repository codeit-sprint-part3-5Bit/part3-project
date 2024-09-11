import { useState, useRef, useCallback, useEffect } from "react";
import {
  EditorState, //편집기의 현재 상태를 나타냄, 편집기에서의 모든 변경 사항(텍스트 입력, 스타일 적용 등)을 관리
  convertToRaw, //ContentState 객체를 JSON 형식의 원시(raw) 콘텐츠 상태로 변환(콘텐츠 저장 및 서버 전송용)
  AtomicBlockUtils, //이미지, 비디오 등과 같은 삽입된 블록(Atomic 블록)을 관리하고 편집기의 콘텐츠에 삽입
  RichUtils, //편집기의 인라인 스타일과 블록 스타일을 관리하는 유틸리티 모음
  ContentBlock, //ContentState 내의 개별 블록을 나타내는 객체
} from "draft-js";
import { Editor as DraftEditor } from "draft-js";
import "draft-js/dist/Draft.css";
import ToolBar from "@/components/wiki/textEditor/toolBar";
import { stateFromHTML } from "draft-js-import-html";
import { Options, stateToHTML } from "draft-js-export-html";
import { blockStyleFn, initialStyleMap } from "contenido";
import ImageUploadWrap from "@/components/wiki/textEditor/toolBar/toolBarComponents/imageUploadWrap";
import ImageUpload from "@/components/wiki/textEditor/toolBar/toolBarComponents/imageUpload";
import { colorList } from "@/components/wiki/textEditor/toolBar/toolBarComponents/colorSelector";
import Media from "@/components/wiki/textEditor/media";
import { ProfileDetail } from "@/types/wiki";
import { imageFileToUrl } from "@/apis/profile";

interface TextEditorProps {
  profile: ProfileDetail;
  onEditorChange: any /*(content: string, htmlContent: string) => void;*/; //임시로 any 줌
  initialContent?: string;
}

const TextEditor = ({
  profile,
  onEditorChange = () => {}, //임시 기본값
  initialContent,
}: TextEditorProps) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (initialContent) {
      try {
        const contentState = stateFromHTML(initialContent); //HTML 콘텐츠를 Draft.js ContentState로 변환
        setEditorState(EditorState.createWithContent(contentState)); //변환된 ContentState로 EditorState 생성
      } catch (error) {
        console.error("Error parsing initial content:", error);
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [initialContent]);

  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  //DraftEditor 컴포넌트에 대한 참조를 저장하여 직접 접근할 수 있게 함
  //DraftEditor에 직접 접근해야 할 때 (포커스 설정 등) editorRef.current를 통해 참조를 사용
  const editorRef = useRef<DraftEditor>(null);

  //Draft.js 에디터에서 인라인 스타일을 정의하는 객체. 컬러 셀렉터에서 정의된 색상 스타일 포함
  const styleMap = {
    ...initialStyleMap,
    ...Object.fromEntries(
      colorList.map((color) => [color.name, { color: color.color }])
    ),
  };

  //styleMap의 각 스타일 이름과 해당 스타일 속성을 포함하는 객체, Draft.js의 inlineStyle 기능에 사용
  const inlineStyles = Object.entries(styleMap).reduce<
    Record<string, { style: React.CSSProperties }>
  >((acc, [key, value]) => {
    acc[key] = { style: value as React.CSSProperties };
    return acc;
  }, {});

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);

    const options: Options = {
      inlineStyles: inlineStyles,
      blockStyleFn: (block) => {
        const alignment = block.getData().get("text-align");
        if (alignment) {
          return {
            style: `text-align: ${alignment};`,
          };
        }
        return {};
      },
      entityStyleFn: (entity: any) => {
        const entityType = entity.get("type").toLowerCase();
        if (entityType === "image") {
          const data = entity.getData();
          return {
            element: "img",
            attributes: {
              src: data.src,
              alt: data.alt || "",
            },
            style: {
              maxWidth: "100%",
              height: "auto",
            },
          };
        }
      },
    };

    let htmlContent = stateToHTML(contentState, options);

    //변환된 HTML 문자열에서 <ol>과 <ul> 태그를 찾아 내부의 <li> 태그들의 스타일을 수정하는 역할을 함
    //HTML에서 <ol> 또는 <ul> 태그와 그 내부의 내용을 모두 찾는 정규식
    htmlContent = htmlContent.replace(/<(ol|ul)>[\s\S]*?<\/\1>/g, (match) => {
      return match.replace(
        /<li([^>]*)>([\s\S]*?)<\/li>/g, //목록 안의 각 <li> 태그를 찾아내는 정규식
        (liMatch, liAttributes, liContent) => {
          //liContent와 일치하는 블록을 rawContentState.blocks에서 찾고, 저장된 정렬 정보(text-align)를 가져옴
          const block = rawContentState.blocks.find(
            (b) => b.text.trim() === liContent.trim()
          );
          const alignment = block?.data?.["text-align"];
          return alignment //정렬 정보가 있는 경우 <li> 태그에 인라인 스타일로 text-align을 추가해 정렬을 적용
            ? `<li${liAttributes} style="text-align: ${alignment};">${liContent}</li>`
            : liMatch; //정렬 정보가 없으면 기존의 <li> 태그를 그대로 반환
        }
      );
    });

    const styledHtmlContent = htmlContent
      .replace(
        //순서 없는 목록 스타일을 찾아 인라인 스타일을 추가
        /<ul>/g,
        '<ul style="list-style-type: disc; padding-left: 20px;">'
      )
      .replace(
        //순서 있는 목록 스타일을 찾아 인라인 스타일을 추가
        /<ol>/g,
        '<ol style="list-style-type: decimal; padding-left: 20px;">'
      );

    onEditorChange(styledHtmlContent, styledHtmlContent);
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  //RichUtils.handleKeyCommand를 사용하여 명령을 처리하고 새로운 에디터 상태를 반환
  const handleKeyCommand = useCallback(
    (command: string, editorState: EditorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        handleEditorChange(newState);
        return "handled";
      }
      return "not-handled";
    },
    []
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        const response = await imageFileToUrl(file);
        const src = response.data.url;
        setImageUrl(src);
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          //이미지 엔티티를 생성
          "IMAGE",
          "IMMUTABLE", //수정 불가능한 엔티티임을 의미
          { src }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {
          currentContent: contentStateWithEntity,
        });
        handleEditorChange(
          AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
        );
      } catch (error) {
        console.error("Failed to upload image:", error);
        alert("이미지 업로드에 실패했습니다.");
      }
      setIsImageUploadOpen(false);
    },
    [editorState]
  );

  //blockRendererFn은 Draft.js에서 특정 블록을 커스텀 렌더링할 때 사용
  //contentBlock을 입력으로 받아, 해당 블록의 타입이 atomic일 경우 Media 컴포넌트를 반환
  const blockRendererFn = (contentBlock: ContentBlock) => {
    if (contentBlock.getType() === "atomic") {
      return {
        component: Media,
        editable: false,
      };
    }
    return null;
  };

  return (
    <div className="w-full mx-auto">
      <div className="rounded-md mb-5">
        <ToolBar
          editorState={editorState}
          onEditorChange={handleEditorChange}
          onImageUpload={() => setIsImageUploadOpen(true)}
          profile={profile}
        />
        <div
          className="min-h-[200px] overflow-x-hidden overflow-y-auto mt-16 break-words"
          onClick={focusEditor}
        >
          <DraftEditor
            ref={editorRef}
            editorState={editorState}
            onChange={handleEditorChange}
            handleKeyCommand={handleKeyCommand}
            placeholder="placeholder 추가 예정"
            blockRendererFn={blockRendererFn}
            blockStyleFn={blockStyleFn}
            customStyleMap={styleMap}
          />
        </div>
      </div>

      {isImageUploadOpen && (
        <ImageUploadWrap
          onClose={() => setIsImageUploadOpen(false)}
          contents={() => <ImageUpload onImageUpload={handleImageUpload} />}
        />
      )}
    </div>
  );
};
export default TextEditor;
