module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // 브라우저 환경에서 테스트
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"], // 확장자 지원
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // @ 경로 매핑
  },
  transform: {
    "^.+\\.[tj]sx?$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.jest.json" }], // Jest 전용 tsconfig 사용
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"], // 테스트 환경 초기화
  testMatch: ["<rootDir>/src/__tests__/**/*.(spec|test).(ts|tsx)"], // 테스트 파일 경로
};
