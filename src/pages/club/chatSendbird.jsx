import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SendBird from "sendbird";

const APP_ID = "YOUR_APP_ID"; // Sendbird Application ID를 여기에 입력하세요.
const USER_ID = "YOUR_USER_ID"; // 사용자의 ID를 여기에 입력하세요.

const ChatSendbird = () => {
    const { id } = useParams();
    const [channel, setChannel] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const sb = new SendBird({ appId: APP_ID });

        sb.connect(USER_ID, (user, error) => {
            if (error) {
                setError(`Sendbird 연결 실패: ${error.message}`);
                return;
            }

            sb.OpenChannel.getChannel(id, (openChannel, error) => {
                if (error) {
                    setError(`채널 로드 실패: ${error.message}`);
                    return;
                }

                openChannel.enter((openChannel, error) => {
                    if (error) {
                        setError(`채널 입장 실패: ${error.message}`);
                        return;
                    }

                    setChannel(openChannel);
                    console.log("채널 입장 성공:", openChannel);
                });
            });
        });

        return () => {
            if (channel) {
                channel.exit((response, error) => {
                    if (error) {
                        console.error("채널 퇴장 실패:", error);
                    } else {
                        console.log("채널 퇴장 성공:", response);
                    }
                });
            }
        };
    }, [id]);

    if (error) {
        return <p>오류 발생: {error}</p>;
    }

    if (!channel) {
        return <p>채널 로딩 중...</p>;
    }

    return (
        <div>
            <h2>채팅방</h2>
            <p>채널 이름: {channel.name}</p>
            {/* Sendbird UI Kit 또는 custom UI를 사용하여 채팅 기능 구현 */}
        </div>
    );
};

export default ChatSendbird;