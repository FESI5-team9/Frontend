//Base

// requestBase
export type RequestBase = {
  type?: "CAFE" | "RESTAURANT" | "PUB" | "VEGAN"; // 모임 종류
  location?: string; //지역구
};

export type PaginationParams = {
  // 페이지네이션
  userId?: number;
  size?: number; // 한번에 불러오는 갯수
  page?: number; // 부르는 페이지
  sort?: string; // 데이터 정렬방식
  direction?: "desc" | "asc"; // 최신순 오래된순
};

// responseBase
export type ResponseBase = {
  id: number; // 모임 아이디
  status: "RECRUITING" | "RECRUITMENT_COMPLETED"; // 모임 상태
  type: "CAFE" | "RESTAURANT" | "PUB" | "VEGAN"; // 모임 종류
  name: string; // 모임 이름
  dateTime: string; // 모임 일
  registrationEnd: string; // 모임 마감일
  location: // 지역구 = 시,도
  | "SEOUL"
  | "GYEONGGI_DO"
  | "GANGWON_DO"
  | "CHUNGCHEONG_DO"
  | "GYEONGSANG_DO"
  | "JEOLLA_DO"
  | "JEJU_ISLAND";
  address1: string; // 시, 군, 구
  address2: string; // 상세주소
  description: string; // 모임 설명
  keyword: string[]; // 모임 키워드
  openParticipantCount: number; // 개설 확정인원
  participantCount: number; // 현재 참가자수
  capacity: number; // 최대 참가인원
  image: string; // 모임사진
  createdAt: string; // 생성일
  canceledAt: string; // 모임을 취소시킨 날짜
  user: User; // 유저데이터
};

export type ResponseOption = {
  host: boolean; // 내가 모임장인지 아닌지
  favorite: boolean; // 찜한 모임인지아닌지
  open: boolean; // 개설확정이 났는지 안났는지
  participation: boolean; // 참여 했는지 안했는지
  joinedAt: string; // 언제 참여 신청했는지
  isCompleted: boolean; // 모임이 완료 되었는지 = 모임을 진행했는지
  isReviewed: boolean; // 내가 리뷰를달았는지
  participants: Participant[];
};

export type Participant = {
  gatheringId: number; // 모임 아이디
  joinedAt: string; // 참가신청한 시간
  userId: number; // 유저아이디
  email: string; // 유저 이메일
  nickname: string; // 유저 닉네임
  image: string; // 유저 이미지
};

export type User = {
  id: number; // 유저 아이디
  nickname: string; //유저 닉네임
  image: string; //유저 이미지
};

//모임 상세조회
// response
export type GatheringDetailRes = ResponseBase &
Pick<ResponseOption, "host" | "favorite" | "open" | "participants">;

// 모임 수정 , 모임 생성
// request
export type CreateGathering = RequestBase & {
  name?: string;
  dateTime?: string;
  openParticipantCount?: number;
  capacity?: number;
  image?: string;
  address1?: string;
  address2?: string;
  description?: string;
  keyword?: string[];
};
// response
export type GatheringRes = Omit<
ResponseBase,
"status" | "description" | "openParticipantCount" | "canceledAt" | "user"
>;

// 모임 취소
// response
export type CancelGatheringRes = Omit<ResponseBase, "status" | "openParticipantCount"> &
Pick<ResponseOption, "host">;

// 모임 목록 조회
// request
export type Gatherings = RequestBase &
PaginationParams & {
  createdBy?: string; // 모임 생성일
  id?: number[]; // 모임 아이디를 배열로 받음 -> 여러개의 모임 불러오기 가능
  startDate?: string; // 검색기간 시작날
  endDate?: string; // 검색기간 마지막날
};
// response
export type GatheringsRes = Array<
Omit<ResponseBase, "description" | "keyword" | "openParticipantCount" | "user"> &
Pick<ResponseOption, "open" | "favorite" | "participation">
>;

// 모임 상태 변경
// responseBase GetGatheringRecruitRes

// 특정 모임의 참가자 목록 조회
// request
export type GetGatheringParticipants = PaginationParams;
// response
export type GetGatheringParticipantsRes = Participant[];

// 모임 목록 검색
// requestBase
export type GetSearchGatherings = RequestBase &
PaginationParams & {
  search: string; // 검색 창
};
// response
export type GetSearchGatheringRes = GatheringsRes;

// 로그인된 사용자가 참석한 모임 목록 조회
// requestBase
export type GetMyJoinedGatherings = PaginationParams & {
  completed?: boolean; // 모임을 완료했는지
  reviewed?: boolean; // 리뷰를 썼는지
};
// response
export type GetMyJoinedGatheringsRes = Array<
Omit<ResponseBase, "status" | "description" | "openParticipantCount" | "user"> &
Pick<ResponseOption, "joinedAt" | "isCompleted" | "isReviewed">
>;

// 찜한 모임 목록 조회
// response
export type GatheringsFavoriteRes = GatheringsRes;

// 사용자가 생성한 모임 조회
// requestBase
export type GetUserGatheringParticipants = PaginationParams;
// response
export type GetUserGatheringParticipantsRes = GatheringsRes;
