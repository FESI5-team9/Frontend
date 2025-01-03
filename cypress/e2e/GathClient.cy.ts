/// <reference types="cypress" />
import { filteredGathClientMockData, gathClientMockData } from "../../src/mocks/GathClient";

describe("GatheringClient Component", () => {
  beforeEach(() => {
    // 페이지 방문
    cy.visit("http://localhost:3000/");
  });
  //첫번째 테스트
  it("로딩 중 메시지가 올바르게 표시되는지 확인", () => {
    cy.contains("로딩 중...").should("be.visible");
  });
  //두번째 테스트
  it("모임 데이터가 없을 때 메시지가 올바르게 표시되는지 확인", () => {
    cy.intercept("GET", "/api/gatherings*", { body: { pages: [] } }).as("getEmptyGatherings");
    cy.wait("@getEmptyGatherings");

    cy.contains("아직 모임이 없어요.", { timeout: 10000 }).should("be.visible");
    cy.contains("지금 바로 모임을 만들어보세요.", { timeout: 10000 }).should("be.visible");
  });
  //세번째 테스트
  it("모임 데이터를 올바르게 렌더링하는지 확인", () => {
    cy.intercept("GET", "/api/gatherings*", { body: gathClientMockData }).as("getGatherings");

    cy.visit("http://localhost:3000/");
    cy.wait("@getGatherings").then(interception => {
      if (!interception.response) {
        console.error("No response received for interception");
      }
    });

    // 카드 요소 확인
    cy.get('[data-testid="card"]', { timeout: 30000 }).should("have.length", 10);
    // 개별 카드 내용 확인
    cy.get('[data-testid="card"]')
      .first()
      .within(() => {
        cy.contains("코카펍 홍대점").should("be.visible");
      });

    cy.get('[data-testid="card"]')
      .last()
      .within(() => {
        cy.contains("루프탑 파티").should("be.visible");
      });
  });
  //네번째 테스트
  it("필터를 변경했을 때 URL과 데이터가 업데이트되는지 확인", () => {
    it("필터를 변경했을 때 URL과 데이터가 업데이트되는지 확인", () => {
      let requestCount = 0; // 요청 카운터

      cy.intercept("GET", "/api/gatherings*", req => {
        const url = new URL(req.url);

        // type=PUB, page=0 요청만 응답
        if (
          url.searchParams.get("type") === "PUB" &&
          url.searchParams.get("page") === "0" &&
          requestCount === 0
        ) {
          requestCount++;
          req.reply({ body: filteredGathClientMockData }); // 첫 요청만 목데이터로 응답
        } else {
          req.reply({ body: { pages: [] } }); // 나머지 요청 무시
        }
      }).as("getFilteredGatherings");

      // 테스트 시작: URL에 type=PUB과 page=0 추가
      cy.visit("http://localhost:3000/?type=PUB&page=0");

      // 첫 번째 요청 대기
      cy.wait("@getFilteredGatherings", { timeout: 10000 });

      // URL 확인
      cy.url().should("include", "type=PUB");
      cy.url().should("include", "page=0");

      // 데이터 확인
      cy.get('[data-testid="card"]').should("have.length", 10);
      cy.contains("이태원 펍 모임").should("be.visible");
      cy.contains("루프탑 강남 파티").should("be.visible");
    });
  });
});
