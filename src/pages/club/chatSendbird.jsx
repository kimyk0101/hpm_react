// import SendbirdApp from "@sendbird/uikit-react/App";
// import "@sendbird/uikit-react/dist/index.css";

// const ChatSendbird = () => {
//   return (
//     <div className="App">
//       <SendbirdApp
//         appId = "import.meta.env.VITE_APP_SENDBIRD_APP_ID" // 본인 앱 아이디 복붙
//         userId="import.meta.env.VITE_APP_SENDBIRD_USER_ID" // 유저 아이디 설정
//         nickname="min" // 유저 닉네임 설정
//         theme="dark"	// 다크모드로 변경 "light"가 default 값임
//       />
//     </div>
//   );
// };

// export default ChatSendbird;





import SendbirdApp from "@sendbird/uikit-react/App";
import "@sendbird/uikit-react/dist/index.css";


const APP_ID = import.meta.env.VITE_APP_SENDBIRD_APP_ID;
const USER_ID = import.meta.env.VITE_APP_SENDBIRD_USER_ID;
const ACCESS_TOKEN = import.meta.env.VITE_APP_SENDBIRD_ACCESS_TOKEN;
const CHANNEL_URL = "sendbird_open_channel_23487_ac3ae21dfc95afc170944518fbb785cb6ab35d11"; // 원하는 채팅방 URL 입력

const ChatSendbird = () => {
    console.log("APP_ID:", APP_ID);
    console.log("USER_ID:", USER_ID);
    console.log("CHANNEL_URL:", CHANNEL_URL);
    console.log("ACCESS_TOKEN:", ACCESS_TOKEN);

    return (
        <SendbirdApp
            appId={APP_ID}
            userId={USER_ID}
            accessToken={ACCESS_TOKEN}
            channelUrl={CHANNEL_URL} // 특정 채팅방만 열기
            theme="dark"
            showSearchIcon={true}
            nickname={"민정"}
        />
    );
};

export default ChatSendbird;