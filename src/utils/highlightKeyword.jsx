// 텍스트에서 검색 키워드를 찾아서
// 해당 부분을 <span class="highlight">...</span>으로 감싸주는 역할
// 화면에 "강조 효과"를 줄 수 있음

export const highlightKeyword = (text, keyword) => {
  // 검색어(keyword)나 원본 텍스트(text)가 비어있으면 그대로 반환
  if (!keyword || !text) return text;

  // 검색어와 일치하는 부분을 찾기 위한 정규식(대소문자 무시, 전체 검색)
  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = text.split(regex);

  // 텍스트를 keyword를 기준으로 나눠서 배열로 만듦
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={i} className="highlight">
        {part}
      </span>
    ) : (
      part
    )
  );
};

// 검색어가 포함된 문자열 중 검색어만 따로 하이라이트하려면
// 문자열을 쪼개고, 하이라이트 처리하고, 다시 이어 붙이는 과정이 필요

// RegExp: 문자열에서 패턴을 찾기 위해 사용하는 도구
// 검색어를 기준으로 자르고, 검색어도 배열에 포함시키기 위함
// 예제: keyword = "산"
// regex = /(\산)/gi

// g: global => 전체에서 찾기
// i: ignore case => 대소문자 구분 안 함
