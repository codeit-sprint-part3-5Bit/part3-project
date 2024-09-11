import { ContentState, ContentBlock } from "draft-js";
//ContentState는 에디터의 상태, ContentBlock은 텍스트 블록

interface MediaComponentProps {
  contentState: ContentState; //에디터의 현재 콘텐츠 상태 (draft-js에서 제공하는 콘텐츠 객체)
  block: ContentBlock; //에디터에서의 특정 블록. 이미지와 같은 미디어 콘텐츠를 포함할 수 있음
}

const Media = ({ contentState, block }: MediaComponentProps) => {
  //Entity는 draft-js에서 텍스트에 추가적인 정보를 추가할 수 있는 구조 (텍스트 내에 미디어 콘텐츠 삽입 시 사용)
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src } = entity.getData();
  return (
    <img
      src={src}
      alt="Uploaded content"
      width={500}
      height={300}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
};

export default Media;
