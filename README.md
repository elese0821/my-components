## 시작하기
```javascript
npm install -D sass // sass
npm install react-router-dom // 라우팅
npm install axios // 

npx tailwindcss init -p // 테일윈드 사용
npm install -D tailwindcss postcss autoprefixer // 자바스크립트로 css를 트랜스포밍해주는 툴

npm install victory // 차트 라이브러리

npm install @fullcalendar/core // 일정 관련 라이브러리  https://fullcalendar.io/docs/react
npm install @fullcalendar/react  // 일정 관련 라이브러리
npm install @fullcalendar/daygrid // 일정 관련 라이브러리
npm install @heroicons/react // icon 라이브러리 Tailwind CSS와 사용하기좋음

npm install dayjs // 시간 라이브러리 https://day.js.org/ 
// https://velog.io/@hongsoom/Library-day.js-%EB%82%A0%EC%A7%9C-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC

npm install zustand // 상태관리 라이브러리
npm install react-modal // 모달창 라이브러리
npm install framer-motion //react호환 좋은 애니메이션 라이브러리
react-select // input select
npm install react-datepicker --save // datepicker

npm install react-daum-postcode//주소 

npm install react-kakao-maps-sdk //카캌오맵



// 웹소켓 채팅구현
npm install sockjs-client //SockJS는 웹소켓 API를 에뮬레이션하는 라이브러리로, 웹소켓이 지원되지 않는 브라우저에서도 웹소켓과 유사한 기능을 제공할 수 있게 도와줌
npm install stompjs //STOMP(간단한 텍스트 지향 메시징 프로토콜)은 웹소켓 위에서 작동하는 메시징 프로토콜

```
```javascript
사용제외
npm install @mui/material @emotion/react @emotion/styled // ui 라이브러리
npm install @mui/icons-material
npm install @fontsource/roboto

npm install @mui/x-data-grid // 데이터 그리드(테이블) https://mui.com/x/react-data-grid/getting-started/#installation 
npm install @mui/material @emotion/react @emotion/styled // 

npm install classnames // module css 중복 사용시 필요
npm install react-geocode // 주소 좌표 변환
npm install react-cookie // 쿠키사용
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit // 글쓰기 에디터
npm install @tiptap/extension-text
npm install @tiptap/extension-color
npm i @tiptap/core @tiptap/extension-bold @tiptap/extension-bubble-menu @tiptap/extension-code @tiptap/extension-document @tiptap/extension-history @tiptap/extension-italic @tiptap/extension-paragraph @tiptap/extension-strike @tiptap/extension-text @tiptap/extension-underline
```
### 프로젝트 특징
reactjs vite로 빌드 


##  라이브러리
###  WebSocket
`sockjs-client`
- SockJS: WebSocket API를 추상화하여, 브라우저 간 호환성을 제공하는 JavaScript 라이브러리입니다. WebSocket이 지원되지 않는 브라우저에서도 동일한 인터페이스를 사용하여 실시간 통신을 구현할 수 있도록 폴백 옵션을 제공합니다. 이는 서버와의 연결을 유지하기 위해 WebSocket, AJAX 폴링, AJAX 스트리밍 등 여러 트랜스포트 방식을 내부적으로 사용할 수 있습니다.
>주요 역할: WebSocket 연결의 일관성과 안정성을 보장하면서, 모든 브라우저에서 웹소켓과 유사한 기능을 사용할 수 있도록 해줍니다.

`stompjs`
- STOMP (Simple Text Oriented Messaging Protocol): 메시징 프로토콜 중 하나로, 프레임 기반의 형식을 사용하여 헤더와 바디로 메시지를 구성합니다. STOMP는 클라이언트와 서버 간에 메시지를 교환할 때 사용되는 텍스트 기반 프로토콜입니다.
`stompjs`: 이 라이브러리는 WebSocket 연결을 통해 STOMP 메시징 프로토콜을 구현합니다. STOMP를 사용하면 구독(subscribe)과 발행(publish) 메커니즘을 통해 메시지를 교환할 수 있으며, 특정 토픽에 대한 메시지를 구독하거나 해당 토픽에 메시지를 발행할 수 있습니다.
>주요 역할: 서버와 클라이언트 간의 메시지 교환을 위한 고급 인터페이스를 제공하며, 메시지 브로커나 메시지 큐와의 통신을 쉽게 구현할 수 있도록 도와줍니다.

`결합 사용`
- sockjs-client와 stompjs를 결합하여 사용하면, SockJS를 통한 안정적이고 광범위한 브라우저 지원과 STOMP를 통한 메시징 관리의 이점을 동시에 얻을 수 있습니다. 이는 실시간 웹 애플리케이션, 특히 실시간 채팅, 대시보드, 협업 툴 등에 매우 유용합니다.

---


### SockJS
####개념
>SockJS는 웹소켓 API를 에뮬레이션하는 라이브러리로, 웹소켓이 지원되지 않는 브라우저에서도 웹소켓과 유사한 기능을 제공할 수 있게 도와줍니다. SockJS는 클라이언트와 서버 사이에 낮은 대기 시간의 연결을 생성하고 유지하는 데 도움을 줍니다.

- 작동 방식
SockJS 클라이언트 라이브러리는 서버와의 통신을 위해 다양한 트랜스포트(WebSocket, HTTP 스트리밍, 폴링 등)를 시도합니다. 클라이언트와 서버 간에 가장 효율적인 통신 방법을 자동으로 선택하여, 최적의 연결 방법을 사용하게 됩니다.

- 사용 예
```
import SockJS from 'sockjs-client';

const sock = new SockJS('http://yourserver.com/mywebsocket');
sock.onopen = function() {
    console.log('open');
    sock.send('test');
};

sock.onmessage = function(e) {
    console.log('message', e.data);
    sock.close();
};

sock.onclose = function() {
    console.log('close');
};
```

### stompjs
#### 개념
>STOMP(간단한 텍스트 지향 메시징 프로토콜)은 웹소켓 위에서 작동하는 메시징 프로토콜입니다. 이를 사용하면 서버와 클라이언트 간에 구독 및 메시징을 통해 메시지를 교환할 수 있습니다.

- 작동 방식
stompjs는 STOMP 프로토콜의 클라이언트 구현체로, 메시지를 JSON, XML 또는 단순 문자열 형태로 송수신할 수 있습니다. 구독(subscribe)을 통해 특정 '주제'에 대한 메시지를 수신하고, 발행(publish)을 통해 메시지를 보낼 수 있습니다.

- 사용 예
```
import { Stomp } from 'stompjs';
import SockJS from 'sockjs-client';

const socket = new SockJS('http://yourserver.com/mywebsocket');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/greetings', function(greeting) {
        console.log(JSON.parse(greeting.body).content);
    });
    stompClient.send("/app/hello", {}, JSON.stringify({ 'name': 'WebClient' }));
});
```
- 결합 사용
>sockjs-client와 stompjs를 결합하면, SockJS가 제공하는 브라우저 간 호환성과 STOMP를 통한 메시징 기능을 함께 활용할 수 있습니다. 이 조합은 특히 실시간 데이터 교환과 이벤트 기반의 어플리케이션에 이상적입니다. 이 두 라이브러리를 함께 사용하면 웹소켓 연결의 복잡성을 추상화하고, 메시징 프로토콜을 통해 손쉽게 메시지를 교환할 수 있어, 실시간 웹 애플리케이션 개발을 크게 단순화할 수 있습니다.



`옵셔널 체이닝, 구조분해할당`

jwt 토큰 만료 세션 만료 확인필요
