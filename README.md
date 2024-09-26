# Wiki project
- 자신에 대해 소개하는 위키 페이지를 작성하고 공유할 수 있어요.
- 그리고 모두가 서로의 위키 페이지 작성에 직접 참여해서 각자의 위키를 모두와 함께 만들어 갈 수 있어요!

## 개발 기간
- 2024.08.30 ~ 2024.09.19 (3주)

## 팀원
| [![장용한][장용한 프로필]][장용한] | [![강효성][강효성 프로필]][강효성] | [![서지훈][서지훈 프로필]][서지훈] | [![옥승현][옥승현 프로필]][옥승현] | [![최원혁][최원혁 프로필]][최원혁] |
| :-------: | :-------: | :-------: | :-------: | :-------: |
| [장용한][장용한] | [강효성][강효성] | [서지훈][서지훈] | [옥승현][옥승현] | [최원혁][최원혁] |
| 위키페이지 구현 <br/> 프로젝트 구현 영상 제작 | 위키페이지 구현 <br/> 프로젝트 발표 | 로그인 기능 구현 <br/> 회원가입 기능 구현 | 메인 랜딩페이지 <br/> 프로젝트 문서화 작업 | 자유게시판 페이지 <br/> 발표 PPT 제작 |


## 미리보기
![시연영상gif](https://github.com/user-attachments/assets/5058a382-094e-476f-8eeb-f649a0d4745d)


## 기술스택
![image](https://github.com/user-attachments/assets/8a8e2135-d54e-426a-8432-9df4a4e75816)



## 프로젝트 구조
```txt
📦 
├─ 📂.github
│  └─ 📂ISSUE_TEMPLATE
│     ├─ Issue_Templage
│     └─ pull_request_template.md
├─ .gitignore
├─ README.md
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  └─ 📂assets
│     └─ 📂Icons
└─ 📂src
   ├─ 📂apis
   │  ├─ base.ts
   │  ├─ login
   │  ├─ notificationListAp
   │  ├─ profile.ts
   │  └─ register
   ├─ 📂component
   │  ├─ 📂AlarmMenu
   │  │  ├─ elapsedTimeConverter
   │  │  ├─ noNotificationI
   │  │  ├─ notificationLis
   │  │  ├─ useNotificationLis
   │  │  └─ useOutsideClic
   │  ├─ 📂ContentWriter.ts
   │  ├─ 📂Nav.tsx
   │  ├─ 📂common
   │  │  ├─ ImageModal.tsx
   │  │  ├─ authButton.tsx
   │  │  ├─ authInput.tsx
   │  │  └─ customInput.tsx
   │  ├─ 📂context
   │  │  └─ AuthContext.tsx
   │  ├─ 📂login
   │  │  └─ loginForm.tsx
   │  ├─ 📂mainpage
   │  │  └─ MainLanding.tsx
   │  ├─ 📂register
   │  │  └─ signupForm.tsx
   │  ├─ 📂wiki
   │  │  ├─ Snackbar.tsx
   │  │  ├─ 📂profileContentArea
   │  │  │  └─ 📂textEdito
   │  │  │     ├─ medi
   │  │  │     └─ toolBa
   │  │  ├─ 📂profileHe
   │  │  ├─ 📂sideProfil
   │  │  │  ├─ OriginalProfile
   │  │  │  └─ index.ts
   │  │  └─ 📂wikiModal
   │  │     ├─ Modals
   │  │     └─ index.t
   │  └─ 📂wikiList
   │     ├─ ProfileList.tsx
   │     └─ SearchForm.tsx
   ├─ 📂lib
   │  └─ axios.tsx
   ├─ 📂pages
   │  ├─ AccountSet
   │  ├─ _app.ts
   │  ├─ _document.tsx
   │  ├─ 📂articles
   │  │  └─ create.tsx
   │  ├─ 📂board
   │  │  ├─ [articleId].tsx
   │  │  └─ edit
   │  ├─ index.t
   │  ├─ login
   │  ├─ registe
   │  ├─ wik
   │  └─ wikiLis
   ├─ 📂style
   │  └─ globals.css
   ├─ 📂types
   │  ├─ 📂login
   │  │  └─ types.ts
   │  ├─ regist
   │  └─ wiki.ts
   └─ 📂utils
      ├─ localStorage
      └─ toke
```

## 🚨트러블슈팅1
- 발생 : 
텍스트 에디터를 만들기 위해 지난 프로젝트에서 사용한 React-quill 라이브러리를 사용했으나, 오류발생
- 원인 : 
mutation events로 인한 콘솔 오류가 출력됨을 확인, 이로 인해 큰 성능 저하와 더불어 크롬에선 24년 내로 사용 중지까지 선언했음을 확인
- 해결 :
react-draft-wysiwyg 라이브러리를 사용하여 해결 하려했으나 한글 관련 버그가 있음을 뒤늦게 확인 후  draft.js.를 커스텀하여 사용하는 것으로 해결 

## 🚨트러블슈팅2
- 발생 :
위키 프로필 리스트를 작업 중 리액트 쿼리를 사용하였으나, 캐쉬문제로 인하여 데이터가 한박자 늦게 랜더링 되는 오류
- 원인 :
리액트 devtoosl에서 확인, 캐쉬가 있을때는 작동하지만  전체 컴포넌트가 리랜더링 되면서 상태가 초기화가 됨
- 해결 :
placehoder옵션을 통해서 캐쉬가 없을 때 보여줄  데이터를 주니 정상적으로 데이터 로딩 확인 가능 



## 📌회고

- 장용한 : 처음 접하는 기능들을 구현하는 동안 많은 시간 소모가 있었지만, 이와 관련된 학습도 진행하고 결과물에 대한 더 큰 성취감도 얻을 수 있었던 시간이었습니다.

- 강효성 : api를 활용하는 부분에 있어 정말 많은 연습이 되었습니다. 또 새로운 기능들에 대한 보다 더 주도적이고 적극적인 학습을 경험 하게 된 것 같습니다. 전체적으로 압박감을 견뎌내고 이를 극복해내는 좋은 경험이 되었습니다.

- 서지훈 : 이번 프로젝트를 통해 JWT 토큰 기반의 로그인 및 회원가입 동작 과정을 이해하고 구현하는 시간을 가졌습니다. 또한, 토큰을 안전하게 관리하고 사용하는 방법에 대해서도 배울 수 있는 기회를 가졌습니다.

- 옥승현 : 낯선 기능들을 구현하는 데에 많은 어려움과 시간 소모가 있었지만, 이에 대한 역량 또한 강화되는 것을 느꼈습니다.

- 최원혁 : 백엔드에 대한 이해도가 향상됐다는 느낌을 받았고 사전 기획 단계에서 최대한 꼼꼼하고 많은 피드백이 오갈수록 실제 개발단계에서 더 수월하게 작업할 수 있다는것을 느꼈습니다.






<!-- Links -->
[장용한]: https://github.com/jangyonghan
[강효성]: https://github.com/Happ-yee4831
[서지훈]: https://github.com/SealBros
[옥승현]: https://github.com/SeungHyunOK
[최원혁]: https://github.com/cwonhyeok

<!-- Profile Links -->
[장용한 프로필]: https://avatars.githubusercontent.com/u/169638454?v=4
[강효성 프로필]: https://avatars.githubusercontent.com/u/170175553?v=4
[서지훈 프로필]: https://avatars.githubusercontent.com/u/122066277?v=4
[옥승현 프로필]: https://avatars.githubusercontent.com/u/133335976?v=4
[최원혁 프로필]: https://avatars.githubusercontent.com/u/169676867?s=400&u=59acff7ec0d1f8334fd0f0f7df947749d9a57544&v=4