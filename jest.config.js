module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // @ 경로를 src로 매핑
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // TypeScript 및 JSX 변환
  },
  testMatch: ["<rootDir>/src/__tests__/**/*.(spec|test).(ts|tsx)"], // 테스트 파일 경로
};
