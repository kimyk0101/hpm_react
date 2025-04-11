import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../css/MountainResult.css'; // CSS 파일 임포트
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../components/Header/Header";
import { TiChevronLeftOutline, TiChevronRightOutline } from 'react-icons/ti'; // react-icons 임포트

const MAX_VISIBILITY = 3; // 보여지는 카드 수 제한

const MountainCard = ({ mountain, active, isCenter }) => (
    <div className={`card ${isCenter ? 'center' : ''}`} style={{ 
        border: isCenter ? '6px solid #8B4513' : 'none',
        backgroundColor: isCenter ? '#8B4513' : 'transparent' // 배경색 추가
    }}>
        <h2>{mountain.name}</h2>
        <div className="mountain-details">
            <p><strong>[위치] </strong> {mountain.location}</p>
            <p><strong>[소요시간] </strong> {mountain.courseTime}</p>
            <p><strong>[코스이름] </strong>{mountain.courseName}</p><br/>
            <p><strong>[특징] </strong><br/> {mountain.selectionReason}</p>
            <p><strong>[교통수단] </strong><br/> {mountain.transportationInfo}</p>
        </div>
    </div>
);

const MountainResult = () => {
    const location = useLocation();
    const filteredRecommend = location.state?.filteredData || [];
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const count = filteredRecommend.length;

    const getCardColor = (index) => {
        const diff = Math.abs(activeCardIndex - index);
        if (diff === 1) return 'green'; // 현재 카드와 인접한 카드
        if (diff === 2) return '#A8C9A8'; // 현재 카드에서 두 칸 떨어진 카드
        return 'hsl(280deg, 40%, calc(100% - var(--abs-offset) * 50%))'; // 나머지 카드
    };

    return (
        <>
            <header className="header-container">
                <ContentContainer>
                    <Header
                        title="하이펜타"
                        showBack={false}
                        showLogo={true}
                        showIcons={{ search: true }}
                        menuItems={[
                            { label: "커뮤니티", onClick: () => navigate("/communities") },
                            { label: "등산 후기", onClick: () => navigate("/hiking-reviews") },
                            { label: "맛집 후기", onClick: () => navigate("/restaurant-reviews") },
                            { label: "모임", onClick: () => navigate("/clubs") },
                        ]}
                    />
                </ContentContainer>
            </header>
            <br/><br/><br/><br/>

            <div className="mountain-result-container">
                <h1>당신에게 추천드리는 산은.....</h1><br/>
                {filteredRecommend.length > 0 ? (
                    <div className='carousel'>
                        {activeCardIndex > 0 && <button className='nav left' onClick={() => setActiveCardIndex(i => i - 1)}><TiChevronLeftOutline/></button>}
                        {filteredRecommend.map((mountain, i) => (
                            <div className='card-container' key={mountain.name} style={{
                                '--active': i === activeCardIndex ? 1 : 0,
                                '--offset': (activeCardIndex - i) / 3,
                                '--direction': Math.sign(activeCardIndex - i),
                                '--abs-offset': Math.abs(activeCardIndex - i) / 3,
                                'pointer-events': activeCardIndex === i ? 'auto' : 'none',
                                'opacity': Math.abs(activeCardIndex - i) >= MAX_VISIBILITY ? '0' : '1',
                                'display': Math.abs(activeCardIndex - i) > MAX_VISIBILITY ? 'none' : 'block',
                                'background-color': getCardColor(i) // 색상 변경
                            }}>
                                <MountainCard mountain={mountain} active={activeCardIndex === i} isCenter={i === activeCardIndex} />
                            </div>
                        ))}
                        {activeCardIndex < count - 1 && <button className='nav right' onClick={() => setActiveCardIndex(i => i + 1)}><TiChevronRightOutline/></button>}
                    </div>
                ) : (
                    <p className="no-data-message">데이터가 없습니다.</p>
                )}
            </div>
        </>
    );
};

export default MountainResult;