import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey: customApiKey, mode, grade = '중학', studentName = '학생', data = {} } = body;

    const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Gemini API 키가 설정되지 않았습니다. 우측 상단 ⚙️ [설정] 버튼을 눌러 API 키를 입력해주세요.',
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build system prompt based on grade level and Socratic coaching philosophy
    const systemInstruction = `당신은 초·중·고등학생을 위한 친절하고 따뜻하며 명쾌한 탐구 학습 AI 코치 '탐구 나침반 코치'입니다.
핵심 원칙:
1. 절대로 숙제를 대신 작성해주거나 정답을 완벽히 다 지어주지 마세요.
2. 학생이 스스로 생각하고 탐구할 수 있도록 질문을 던지고, 유용한 힌트와 가이드를 제시하는 소크라테스식 코칭을 하세요.
3. 어조: 다정하고 격려하는 한국어 교사 어조 (존댓말, ~해요/했습니다 체).
4. 대상 연령대 (${grade}):
   - 초등: 쉬운 단어, 친근한 비유, 아기자기하고 명확한 문장
   - 중학: 직관적이면서도 기초 개념 및 탐구 절차 강조
   - 고등: 원인분석, 학술적/과학적/사회적 원리 및 종합적 비판적 사고 강조`;

    let prompt = '';

    if (mode === 'topic_hint') {
      prompt = `학생 이름: ${studentName}
학교급: ${grade}
학생이 적은 관심 주제/현상:
"${data.interestTopic || ''}"

위 내용을 바탕으로 학생이 학교 수행평가나 탐구보고서 주제로 삼기 좋은 [💡 탐구 주제 좁히기 힌트]를 작성해주세요.
구체적으로 다음 요소를 포함해주세요:
1. 학생의 관심사에 대한 칭찬과 긍정적 격려
2. 일상 속 주제를 구체적이고 흥미로운 탐구 주제로 좁힌 아이디어 3가지 (각 아이디어마다 간단한 이유/방향 설명)
3. 탐구를 시작할 수 있도록 돕는 따뜻한 마무리 한마디`;
    } else if (mode === 'question_refine') {
      prompt = `학생 이름: ${studentName}
학교급: ${grade}
관심 주제: "${data.interestTopic || ''}"
학생이 작성한 탐구 질문: "${data.inquiryQuestion || ''}"
학생의 예상/가설: "${data.hypothesis || ''}"

위 질문과 가설을 분석하여 [🔍 탐구 질문 다듬기 코칭]을 작성해주세요.
구체적으로 다음 요소를 포함해주세요:
1. 학생이 설정한 질문과 가설의 좋은 점
2. 단순히 '무엇인가?(What)'에 그치지 않고 '왜, 어떻게, 변인 간의 관계(How/Why/Relationship)'를 파악할 수 있는 다듬어진 구체적 탐구 질문 예시 2~3개
3. 가설을 검증할 때 주의하거나 생각해볼 점 힌트`;
    } else if (mode === 'search_guide') {
      prompt = `학생 이름: ${studentName}
학교급: ${grade}
탐구 주제: "${data.interestTopic || ''}"
탐구 질문: "${data.inquiryQuestion || ''}"
가설: "${data.hypothesis || ''}"
학생이 지금까지 조사하고 알게 된 내용: "${data.researchSummary || ''}"

위 내용을 바탕으로 [📚 추천 검색어 & 조사 가이드]를 작성해주세요.
구체적으로 다음 요소를 포함해주세요:
1. 네이버, 구글, 학술 DB에서 찾아보면 좋은 핵심 검색어 (키워드 4~5개)
2. 조사 시 꼭 살펴봐야 할 주요 원리, 과학적/사회적 개념, 관련 법률이나 공식
3. 신뢰할 수 있는 자료 출처 종류 추천 (예: 국립중앙과학관, 통계청, 전문 서적 등)`;
    } else if (mode === 'critical_thinking') {
      prompt = `학생 이름: ${studentName}
학교급: ${grade}
탐구 질문: "${data.inquiryQuestion || ''}"
조사한 내용: "${data.researchSummary || ''}"
학생이 내린 결론: "${data.conclusion || ''}"
새롭게 알게 된 점: "${data.newInsights || ''}"
한계점 및 궁금한 점: "${data.limitations || ''}"

위 분석과 결론을 바탕으로 [🤔 비판적 사고 코칭 (생각의 빈틈 찾기)]을 작성해주세요.
구체적으로 다음 요소를 포함해주세요:
1. 결론 도출 과정에서의 잘한 점 격려
2. 생각의 빈틈을 채워주는 선의의 반론 및 소크라테스식 질문 2~3가지 (예: "혹시 다른 변인이나 외부 요인이 영향을 미쳤을 가능성은 없을까요?", "예외적인 경우는 없었나요?")
3. 탐구의 완성도를 더 높이기 위한 최종 조언`;
    } else {
      return NextResponse.json({ error: '올바르지 않은 코칭 요청입니다.' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const resultText = response.text || '코칭 결과를 생성할 수 없습니다. 다시 시도해주세요.';

    return NextResponse.json({ result: resultText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'AI 코칭 생성 중 오류가 발생했습니다. API 키 및 네트워크 상태를 확인해주세요.' },
      { status: 500 }
    );
  }
}
