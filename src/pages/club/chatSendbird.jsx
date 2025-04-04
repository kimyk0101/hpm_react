import SendbirdApp from "@sendbird/uikit-react/App";
import "@sendbird/uikit-react/dist/index.css";
import { useAuth } from "../../contexts/AuthContext";

const APP_ID = import.meta.env.VITE_APP_SENDBIRD_APP_ID;

const USER_ID = import.meta.env.VITE_APP_SENDBIRD_USER_ID;
const ACCESS_TOKEN = import.meta.env.VITE_APP_SENDBIRD_ACCESS_TOKEN;

const HMANAGER_ID = import.meta.env.VITE_APP_SENDBIRD_HALLASANMANAGER_ID;
const HMANAGER_ACCESS_TOKEN = import.meta.env.VITE_APP_SENDBIRD_HALLASANMANAGER_ACCESS_TOKEN;

const SMANAGER_ID = import.meta.env.VITE_APP_SENDBIRD_SEORAKSANMANAGER_ID;
const SMANAGER_ACCESS_TOKEN = import.meta.env.VITE_APP_SENDBIRD_SEORAKSANMANAGER_ACCESS_TOKEN;

const MMANAGER_ID = import.meta.env.VITE_APP_SENDBIRD_MAISANMANAGER_ID;
const MMANAGER_ACCESS_TOKEN = import.meta.env.VITE_APP_SENDBIRD_MAISANMANAGER_ACCESS_TOKEN;

const ChatSendbird = () => {
    const { user } = useAuth();

    // console.log("APP_ID:", APP_ID);
    // console.log("USER_ID:", USER_ID);
    // console.log("ACCESS_TOKEN:", ACCESS_TOKEN);

    let sendbirdUserId = USER_ID;
    let sendbirdAccessToken = ACCESS_TOKEN;

    if (user && user.user_id) {
        if (user.user_id === "hallasanmanager") {
            sendbirdUserId = HMANAGER_ID;
            sendbirdAccessToken = HMANAGER_ACCESS_TOKEN;
        } else if (user.user_id === "seoraksanmanager") {
            sendbirdUserId = SMANAGER_ID;
            sendbirdAccessToken = SMANAGER_ACCESS_TOKEN;
        } else if (user.user_id === "maisanmanager") {
            sendbirdUserId = MMANAGER_ID;
            sendbirdAccessToken = MMANAGER_ACCESS_TOKEN;
        }
    }

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <SendbirdApp
                appId={APP_ID}
                userId={sendbirdUserId}
                accessToken={sendbirdAccessToken}
                theme="dark"
                showSearchIcon={true}
                nickname={user?.nickname || "익명"}
            />
        </div>
    );
};

export default ChatSendbird;