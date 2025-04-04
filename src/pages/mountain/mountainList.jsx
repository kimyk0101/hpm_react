import React, { useState, useEffect } from "react";
import axios from "axios";
import StickyButton from "../../components/map/StickyButton"; // StickyButton 컴포넌트 임포트
import "../../css/mountain.css";

function MountainList() {
  const [mountainList, setMountainList] = useState([]);
  const [filteredMountainList, setFilteredMountainList] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNo, setPageNo] = useState(1); // 페이지 번호 상태 추가
  const [isFetching, setIsFetching] = useState(false); // 데이터 로딩 상태
  const serviceKey = import.meta.env.VITE_FOREST_API_KEY;

  const fetchAllData = async () => {
    setIsSearched(true);
    try {
      const url =
        "/forest-api/openapi/service/cultureInfoService/gdTrailInfoOpenAPI";
      const params = {
        serviceKey: serviceKey,
        numOfRows: 1000, // 최대값으로 설정
        pageNo: 1, // 페이지 번호
      };

      const allData = [];
      let pageNo = 1;

      while (true) {
        params.pageNo = pageNo;
        const response = await axios.get(
          `${url}?${new URLSearchParams(params).toString()}`
        );
        const data = response.data;

        if (data.response && data.response.body && data.response.body.items) {
          const items = data.response.body.items.item;
          if (Array.isArray(items)) {
            allData.push(...items);
          } else {
            allData.push(items);
          }

          // 더 이상 데이터가 없으면 종료
          if (items.length < params.numOfRows) break;
        } else {
          break;
        }

        pageNo++;
      }

      setMountainList(allData);
      setFilteredMountainList(allData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchMoreData = async () => {
    setIsFetching(true);
    try {
      const url =
        "/forest-api/openapi/service/cultureInfoService/gdTrailInfoOpenAPI";
      const params = {
        serviceKey: serviceKey,
        numOfRows: 1000,
        pageNo: pageNo + 1, // 다음 페이지로 이동
      };

      const response = await axios.get(
        `${url}?${new URLSearchParams(params).toString()}`
      );
      const data = response.data;

      if (data.response && data.response.body && data.response.body.items) {
        const items = data.response.body.items.item;
        if (Array.isArray(items)) {
          setMountainList((prevList) => [...prevList, ...items]);
          setFilteredMountainList((prevList) => [...prevList, ...items]);
        } else {
          setMountainList((prevList) => [...prevList, items]);
          setFilteredMountainList((prevList) => [...prevList, items]);
        }

        setPageNo((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredList = mountainList.filter((mountain) => {
      return (
        mountain.mntnm.toLowerCase().includes(searchTerm) ||
        mountain.subnm.toLowerCase().includes(searchTerm) ||
        mountain.areanm.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredMountainList(filteredList);
  };

  useEffect(() => {
    fetchAllData();
  }, [serviceKey]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight * 0.9
      ) {
        if (!isFetching) {
          fetchMoreData();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching, pageNo]);

  return (
    <div className="container">
      <h1 className="title">산 목록</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="검색어 입력"
          className="search-input"
        />
        <button type="submit" className="search-button">
          검색
        </button>
      </form>
      {isSearched ? (
        <div className="mountain-list">
          {filteredMountainList.map((mountain) => (
            <div key={mountain.mntncd} className="mountain-card">
              <img
                src={`https://i.ibb.co/6cNgZxb6/free-icon-mountain.png`}
                alt={mountain.mntnm}
                className="mountain-image"
              />
              <div className="mountain-info">
                <h2 className="mountain-name">{mountain.mntnm}</h2>
                <p className="mountain-height">고도: {mountain.mntheight}m</p>
                <p className="mountain-location">위치: {mountain.areanm}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>검색 결과가 없습니다.</div>
      )}
      <StickyButton /> {/* StickyButton 추가 */}
    </div>
  );
}

export default MountainList;
