


export type IsoDateString = string;
export type GuidString = string;
export type Base64String = string;

export interface DevExtremeLoadOptions extends Record<string, unknown> {}

export interface AbitAchievementDto {
  Id: number;
  Code: number;
  Name: string | null;
  MaxBall: number | null;
  Counted: number | null;
  Status: string | null;
  BallChanged: boolean | null;
  IdCode: number | null;
  VerifierCode: number | null;
  ChangeDate: IsoDateString | null;
  Year: number | null;
  FileId: number | null;
  AchievementId: number | null;
  FileGuid: GuidString | null;
}

export interface AbitDisciplineDto {
  
}

export interface AbitDocumentDto {
  Id: number;
  Code: number | null;
  DocumentCode: number | null;
  Discipline: string | null;
  Score: string | null;
  Status: string | null;
  DocumentType: string | null;
  DocumentSerial: string | null;
  DocumentNumber: string | null;
  DateOfChange: IsoDateString | null;
  Year: number | null;
  GUID: number | null;
  FileId: number | null;
  FileGuid: GuidString | null;
  DocumentId: number | null;
  FileExt: string | null;
  FileCaption: string | null;
}

export interface AbitExamComputedDto {
  ApplicationCode: number | null;
  Score1: number;
  Score2: number;
  Score3: number;
  Score4: number;
  Score5: number;
  Score6: number;
  AdditionalScoreId: number;
  ScoreSum: number;
  Total: number;
  Count: number;
  NoExamType: boolean;
  Exam1: string | null;
  Exam2: string | null;
  Exam3: string | null;
  Exam4: string | null;
  Exam5: string | null;
  Exam6: string | null;
  Disc1: string | null;
  Disc2: string | null;
  Disc3: string | null;
  Disc4: string | null;
  Disc5: string | null;
  Disc6: string | null;
}

export interface AbitExamInfoDto {
  Id: number;
  ApplicationCode: number;
  BallTotal: number | null;
  InCompetition: number | null;
  Score1: number | null;
  Score2: number | null;
  Score3: number | null;
  Score4: number | null;
  Score5: number | null;
  Score6: number | null;
  Total: number | null;
  AdditionalScoreId: number | null;
  ScoreSum: number | null;
  Exam1: string | null;
  Exam2: string | null;
  Exam3: string | null;
  Exam4: string | null;
  Exam5: string | null;
  Exam6: string | null;
  Disc1: string | null;
  Disc2: string | null;
  Disc3: string | null;
  Disc4: string | null;
  Disc5: string | null;
  Disc6: string | null;
  DiscCode1: number | null;
  DiscCode2: number | null;
  DiscCode3: number | null;
  DiscCode4: number | null;
  DiscCode5: number | null;
  DiscCode6: number | null;
  Mat: number | null;
  Ikt: number | null;
  Fiz: number | null;
  Rus: number | null;
  Him: number | null;
  Ist: number | null;
  Obsh: number | null;
  Ris: number | null;
  Lit: number | null;
  Komp: number | null;
  InYaz: number | null;
  Geo: number | null;
  Bio: number | null;
  TI: number | null;
  RusExam: string | null;
  MatExam: string | null;
  ObshExam: string | null;
  FizExam: string | null;
  HimExam: string | null;
  BioExam: string | null;
  GeoExam: string | null;
  IstExam: string | null;
  IktExam: string | null;
  AvgTotal: number | null;
  AvgEge: number | null;
  AvgVi: number | null;
  MinEgeScore: number | null;
  Date1: IsoDateString | null;
  Date2: IsoDateString | null;
  Date3: IsoDateString | null;
  Date4: IsoDateString | null;
  Date5: IsoDateString | null;
  Date6: IsoDateString | null;
  AdditionalScoreNoEssay: number | null;
  EssayScore: number | null;
  IdWeight: number | null;
  SpecialtyCode: number | null;
  Z: boolean | null;
  U: number | null;
  Agreement: boolean | null;
  Ege: number | null;
  NoEge: number | null;
  MinScore: number | null;
  Admission: number | null;
  Admission1: number | null;
  Admission2: number | null;
  Admission3: number | null;
  Admission4: number | null;
  Admission5: number | null;
  Admission6: number | null;
  Olim100: number | null;
}

export interface AbitMarkDto {
  Id: number;
  ExamCode: number | null;
  Code: number | null;
  Score: number | null;
  Discipline: string | null;
  ExamDate: IsoDateString | null;
  YearOfAdmission: number | null;
}

export interface AbitScreenDto {
  PcName: string | null;
  SpecialtyCode: number;
  SpecialtyName: string | null;
  SpecialtySpecialName: string | null;
  OKSO: string | null;
  BudgetPlaces: number;
  BudgetAgreements: number;
  BudgetAgreementsMinusPlaces: number;
  BudgetAgreementsOriginal: number;
  BudgetAgreementsOriginalMinusPlaces: number;
  KvPlaces: number;
  KvAgreements: number;
  KvAgreementsMinusPlaces: number;
  KvAgreementsOriginal: number;
  KvAgreementsOriginalMinusPlaces: number;
  MinobrPlaces: number;
  MinobrAgreements: number;
  MinobrAgreementsMinusPlaces: number;
  MinobrAgreementsOriginal: number;
  MinobrAgreementsOriginalMinusPlaces: number;
  CnPlaces: number;
  CnAgreements: number;
  CnAgreementsMinusPlaces: number;
  CnAgreementsOriginal: number;
  CnAgreementsOriginalMinusPlaces: number;
  SnPlaces: number;
  SnAgreements: number;
  SnAgreementsMinusPlaces: number;
  SnAgreementsOriginal: number;
  SnAgreementsOriginalMinusPlaces: number;
  EducationLevel: string | null;
  EducationForm: string | null;
  EducationFormCode: number;
  EducationFormName: string;
  EducationFormAbbreviation: string;
  FormCodeFromSpecialties: number;
}

export interface AbitScreenRankDto {
  Id: number;
  ApplicationCode: number | null;
  FullName: string | null;
  SpecialtyCode: number;
  ExamScore1: number | null;
  ExamScore2: number | null;
  ExamScore3: number | null;
  ExamScore4: number | null;
  ExamScore5: number | null;
  ExamScore6: number | null;
  TotalScore: number | null;
  BallId: number | null;
  ScoreSum: number | null;
  Pp: string | null;
  AdmissionConsent: boolean | null;
  Disc1: string | null;
  Disc2: string | null;
  Disc3: string | null;
  Disc4: string | null;
  Disc5: string | null;
  ExamType1: string | null;
  ExamType2: string | null;
  ExamType3: string | null;
  ExamType4: string | null;
  ExamType5: string | null;
  RankNumber: number;
  Dormitory: boolean | null;
  IsBudget: boolean | null;
  IsPaidSn: boolean | null;
  IsTargetCn: boolean | null;
  IsQuotaKv: boolean | null;
  IsMinobr: boolean | null;
  MobilePhone: string | null;
  Priority: number | null;
  CaseNumber: string | null;
  HasOriginal: boolean | null;
  HasAgreementAndOriginal: boolean;
  TrainingType: number;
  HasAgreement: boolean | null;
}

export interface AbitSpisokAbitDto {
  Id: number;
  ApplicationCode: number | null;
  FullName: string | null;
  LastName: string | null;
  FirstName: string | null;
  MiddleName: string | null;
  Email: string | null;
  Mobile: string | null;
  BirthDate: IsoDateString | null;
  Gender: string | null;
  SpecialtyCode: number | null;
  SpecialtyName: string | null;
  SpecialName: string | null;
  Specialization: string | null;
  Profile: string | null;
  Faculty: string | null;
  OKSO: string | null;
  Level: number | null;
  LevelName: string | null;
  LevelCategory: number | null;
  EducationForm: number | null;
  Address: string | null;
  Address2: string | null;
  Dormitory: boolean | null;
  EducationType: string | null;
  School: string | null;
  SchoolLocation: string | null;
  GraduationYear: number | null;
  CertificateSeries: string | null;
  CertificateNumber: string | null;
  EducationDocType: string | null;
  EducationType2: string | null;
  EduDocIssueDate: IsoDateString | null;
  Citizenship: string | null;
  RegionPP: string | null;
  DistrictPP: string | null;
  CountryPP: string | null;
  Region: string | null;
  Original: boolean | null;
  OriginalDocument: boolean | null;
  OriginalSubmissionDate: IsoDateString | null;
  BenefitsName: string | null;
  Snils: string | null;
  PP: string | null;
  WithoutExam: number | null;
  BenefitType: number | null;
  Priority: number | null;
  ServicePriority: number | null;
  EPGUCode: number | null;
  EPGUApplicationCode: number | null;
  Payment: string | null;
  ParentPhone: string | null;
  DocsSubmitDate: IsoDateString | null;
  RefusedEnrollment: boolean | null;
  RefusedEnrollmentDate: IsoDateString | null;
  Enrolled: boolean | null;
  EnrollmentDate: IsoDateString | null;
  Order: string | null;
  TookDocs: boolean | null;
  TookDocsDate: IsoDateString | null;
  Document: string | null;
  Ld: string | null;
  CaseNumber: string | null;
  Gradebook: string | null;
  Status: number | null;
  SpecialStatus: number | null;
  ApplicationStatus: string | null;
  AvgAttestatScore: number | null;
  AverageEgeScore: number;
  EducationService: number | null;
  OOP: number | null;
  CN: number | null;
  SN: number | null;
  QV: number | null;
  MIB: number | null;
  Costs: string | null;
  Sum: string | null;
  AdditionalSet: boolean | null;
  Conditions: string | null;
  LearningConditions: string | null;
  BasisNumber: number | null;
  NumberLD: string | null;
  RecruitmentYear: number | null;
  BenefitDocCode: number | null;
  Deleted: boolean | null;
  OtherVUZ: string | null;
  PlanNabora: string | null;
  OriginalDoc: string | null;
  HighestPriority: boolean | null;
  HighestPriorityText: string | null;
  HighestPriorityOriginal: string | null;
  Exam1: string | null;
  Exam2: string | null;
  Exam3: string | null;
  Exam4: string | null;
  Exam5: string | null;
  Exam6: string | null;
  Disc1: string | null;
  Disc2: string | null;
  Disc3: string | null;
  Disc4: string | null;
  Disc5: string | null;
  Disc6: string | null;
  Score1: number | null;
  Score2: number | null;
  Score3: number | null;
  Score4: number | null;
  Score5: number | null;
  Score6: number | null;
  AdditionalScoreId: number | null;
  NoExamTypeCount: number | null;
  ScoreSum: number | null;
  Scores: number | null;
  Total: string | null;
  Count: number | null;
  NoExamType: boolean | null;
  Company: string | null;
  ConsentedDirection: string | null;
  ConsentUploadDate: IsoDateString | null;
  ConsentFilesCount: number | null;
  GreenWaveDate: IsoDateString | null;
  GreenWaveFilesCount: number | null;
  ReductionDate: IsoDateString | null;
  ReductionFilesCount: number | null;
  PK: string | null;
  StatusDescription: string | null;
  AcceptedLD: string | null;
  OriginalType: string | null;
  Form: string | null;
  AgreementData: IsoDateString | null;
  OperatorFIO: string | null;
  OperatorLogin: string | null;
  LearningLanguage: number | null;
  GUID: GuidString | null;
  EducationFormName: string | null;
  EducationFormShortName: string | null;
  ApplicationStatusName: string | null;
  ContractNumber: string;
  ContractDate: IsoDateString | null;
  Agreement: boolean | null;
  AvgEge: number | null;
  BallId: number | null;
}

export interface AchievementStatusUpdateDto {
  Code: number;
  NewStatus: string;
  MaxBall: number | null;
  Counted: number | null;
  BallChanged: boolean | null;
}

export interface AchievementTypeDto {
  AchievementCode: number;
}

export interface AchievementTypeGroupDto {
  Id: number;
  TypeCode: number;
  GroupCode: number;
}

export interface AchievementTypesController {
  
}

export interface AdmissionCompanyDto {
  CompanyCode: number | null;
  CompanyName: string | null;
}

export interface AllApplicantFullDto {
  Id: number;
  RecruitmentYear: number | null;
  Dormitory: boolean | null;
  LastName: string | null;
  FirstName: string | null;
  MiddleName: string | null;
  FullName: string | null;
  Guid: GuidString | null;
  Email: string | null;
  Mobile: string | null;
  BirthDate: IsoDateString | null;
  Gender: string | null;
  ParentPhone: string | null;
  EpguCode: number | null;
  RegionPP: string | null;
  Citizenship: string | null;
  DistrictPP: string | null;
  School: string | null;
  SchoolLocation: string | null;
  GraduationYear: number | null;
  CertificateSeries: string | null;
  CertificateNumber: string | null;
  EducationDocumentType: string | null;
  EducationType: string | null;
  UdIssueDate: IsoDateString | null;
  Snils: string | null;
  Subdivision: string | null;
  EnrolledTo: string | null;
  Orders: string | null;
  Specialization: string | null;
  DirectionName: string | null;
  Profile: string | null;
  OKSO: string | null;
  Basis: string | null;
  StudyForm: string | null;
  ApplicantStatus: string | null;
  EgeAverage: number | null;
  ConsentFiles: number | null;
  Photo: number | null;
  GreenWaveFiles: number | null;
  ReductionFiles: number | null;
  ConsentUploadDate: IsoDateString | null;
  GreenWaveDate: IsoDateString | null;
  ReductionDate: IsoDateString | null;
}

export interface AllApplicationDto {
  ApplicationCode: number;
  Costs: string | null;
  Sum: string | null;
  ContractNumber: string | null;
  PeriodFrom: IsoDateString | null;
  PeriodTo: IsoDateString | null;
  PaymentPeriod: string | null;
  ReceiptNumber: string | null;
  PayDate: IsoDateString | null;
  PayerType: string | null;
  ContractDate: IsoDateString | null;
  PaymentCode: number | null;
  Consented: boolean | null;
  ConsentDate: IsoDateString | null;
  OperatorCode: number | null;
  ConsentedDirection: string | null;
  ConsentUploadDate: string | null;
  ConsentFilesCount: number | null;
  GreenWaveDate: string | null;
  GreenWaveFilesCount: number | null;
  ReductionDate: string | null;
  ReductionFilesCount: number | null;
  Zachislen: boolean | null;
  Prikaz: string | null;
}

export interface ApplicantDisciplineDto {
  Discipline: string | null;
  Subdivision: string | null;
  ExamType: string | null;
  OKSO: string | null;
  FullName: string | null;
  EgeYear: number | null;
  Score: number | null;
  Status: string | null;
  ExamDate: IsoDateString | null;
  Basis: string | null;
  SubmitDate: IsoDateString | null;
  Gender: string | null;
  StudyForm: string | null;
  Abi: string | null;
  BirthDate: IsoDateString | null;
  Mobile: string | null;
}

export interface ApplicantFastDto {
  Discipline: string | null;
  Subdivision: string | null;
  ExamType: string | null;
  OKSO: string | null;
  FullName: string | null;
  EgeYear: number | null;
  Score: number | null;
  Status: string | null;
  ExamDate: IsoDateString | null;
  Basis: string | null;
  SubmitDate: IsoDateString | null;
  Gender: string | null;
  StudyForm: string | null;
  Abi: string | null;
  BirthDate: IsoDateString | null;
  Mobile: string | null;
}

export interface ApplicantFullDto {
  applicationCode: number;
  pk: string | null;
  lastName: string | null;
  firstName: string | null;
  middleName: string | null;
  recruitmentYear: number;
  specialtyName: string | null;
  faculty: string | null;
  educationForm: number | null;
  original: boolean;
  priority: number | null;
  email: string | null;
  mobile: string | null;
  applicationStatus: string | null;
  planNabora: number;
  avgAttestatScore: number | null;
  avgEge: number | null;
  scoreSum: number | null;
  consentFilesCount: number;
  greenWaveFilesCount: number;
  reductionFilesCount: number;
  contractNumber: string | null;
  contractDate: IsoDateString | null;
  guid: string | null;
}

export interface ApplicantRankDto {
  Id: number;
  FullName: string | null;
  Score: number | null;
  AgreeOriginal: boolean;
  Exam1: number | null;
  Exam2: number | null;
  Exam3: number | null;
  Phone: string | null;
}

export interface ApplicantRankingDto {
  Rank: number;
  Id: number;
  Fio: string | null;
  CaseNumber: string | null;
  ApplicantNumber: string | null;
  SumPoints: number;
  Itogo: number;
  IdPoints: number;
  Priority: number;
  Original: string;
  Consent: string;
  Status: string;
  HighestPriority: boolean;
  HighestPriorityOriginal: boolean;
  Snils: string | null;
  MobilePhone: string | null;
  Email: string | null;
  Region: string | null;
  Dormitory: string | null;
  EnrollmentType: string | null;
  FromPP: string | null;
  WithoutExams: string | null;
  EducationConditions: string | null;
  IndividualAchievementScore: number;
  TotalScore: number;
  AverageCertificateScore: number;
  AverageExamScore: number;
  BirthDate: IsoDateString | null;
  PlanNabora: number;
  StatusZayavleniya: string;
  Enrolled: boolean;
  RefusedEnrollment: boolean;
  NumberLD: string | null;
}

export interface ApplicantsChartPointDto {
  Date: IsoDateString;
  Cumulative: number;
}

export interface ApplicantsChartSeriesDto {
  Year: number;
  Points: ApplicantsChartPointDto[];
}

export interface ApplicationShortDto {
  ApplicationCode: number;
  ContractNumber: string | null;
  PaymentCode: number | null;
  PayerType: number | null;
  ContractDate: IsoDateString | null;
  Costs: string | null;
  Amount: string | null;
}

export interface CustomerDto {
  Code: number;
}

export interface DisciplineDto {
  Code: number;
  Name: string | null;
}

export interface DisciplineFastDto {
  Discipline: string | null;
  DisciplineCode: number | null;
  ExamType: string | null;
  ExamTypeCode: number | null;
}

export interface DocumentShortDto {
  Id: number;
  DocumentCode: number;
}

export interface DocumentStatusUpdateDto {
  DocumentCode: number;
  NewStatus: string;
}

export interface DocumentTypeDto {
  Code: number;
  Name: string | null;
  Comment: string | null;
  ShortName: string | null;
  IsDocument: boolean | null;
}

export interface EducationLevelDto {
  EducationLevelCode: number | null;
  EducationLevelName: string | null;
}

export interface ExamTypeDto {
  Code: number;
  Name: string | null;
  Comment: string | null;
  ShortName: string | null;
}

export interface FileContentDto {
  FileId: number;
  Content: Base64String;
}

export interface MessageRowDto {
  lastName: string | null;
  firstName: string | null;
  middleName: string | null;
  birthDate: IsoDateString | null;
  gender: string | null;
  operatorName: string | null;
  messageText: string | null;
  messageDate: IsoDateString;
  messageIsRead: boolean;
  lastReplyDate: IsoDateString | null;
  lastMessageIsOperatorReply: boolean;
  daysFromLast: number;
  email: string | null;
  mobile: string | null;
  applicantId: number;
}

export interface PaymentEntryDto {
  Code: number;
  PaymentName: string | null;
  IsDate: boolean | null;
  Period: number | null;
  FormCode: number | null;
  IsDeleted: boolean;
}

export interface RoleInfoDto {
  Code: number;
  Name: string | null;
  Program: string | null;
  Object: string | null;
  Column: string | null;
}

export interface SpecialtyCenterDto {
  Id: number;
  SpecialtyCode: number;
  OrgCode: number;
  ProposalNumber: number | null;
}

export interface StudentStatusDto {
  Code: number;
  Status: string | null;
  Description: string | null;
  ShortName: string | null;
}

export interface UserInfoDto {
  Id: number;
  Login: string | null;
  FullName: string | null;
  Email: string | null;
  Phone: string | null;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiEndpoint {
  method: HttpMethod;
  path: string;
  controller: string;
  action: string;
}

export const API_ENDPOINTS = {
  AbitAchievements_Get: { method: "POST", path: "/api/AbitAchievements", controller: "AbitAchievements", action: "Get" },
  AbitAchievements_GetByAbitId: { method: "GET", path: "/api/AbitAchievements/{abitId}", controller: "AbitAchievements", action: "GetByAbitId" },
  AbitDisciplinesFast_GetApplicants: { method: "POST", path: "/api/AbitDisciplinesFast/applicants/{disciplineId}", controller: "AbitDisciplinesFast", action: "GetApplicants" },
  AbitDisciplinesFast_GetDisciplines: { method: "POST", path: "/api/AbitDisciplinesFast/list", controller: "AbitDisciplinesFast", action: "GetDisciplines" },
  AbitDocuments_Get: { method: "POST", path: "/api/AbitDocuments", controller: "AbitDocuments", action: "Get" },
  AbitDocuments_GetByAbitId: { method: "GET", path: "/api/AbitDocuments/{abitId}", controller: "AbitDocuments", action: "GetByAbitId" },
  AbitDocuments_GetFileContent: { method: "GET", path: "/api/AbitDocuments/file/{fileId}/{fileGuid}", controller: "AbitDocuments", action: "GetFileContent" },
  AbitExamComputed_Get: { method: "POST", path: "/api/AbitExamComputed", controller: "AbitExamComputed", action: "Get" },
  AbitMarks_Get: { method: "POST", path: "/api/AbitMarks", controller: "AbitMarks", action: "Get" },
  AbitScreen_GetScreen: { method: "POST", path: "/api/AbitScreen/list", controller: "AbitScreen", action: "GetScreen" },
  AbitScreen_GetRank: { method: "POST", path: "/api/AbitScreen/rank", controller: "AbitScreen", action: "GetRank" },
  AbitSpisokAbit_Get: { method: "POST", path: "/api/AbitSpisokAbit", controller: "AbitSpisokAbit", action: "Get" },
  AbitSpisokAbit_GetDistinct: { method: "POST", path: "/api/AbitSpisokAbit/distinct", controller: "AbitSpisokAbit", action: "GetDistinct" },
  AchievementTypes_GetAll: { method: "GET", path: "/api/achievement-types", controller: "AchievementTypes", action: "GetAll" },
  AchievementTypes_Get: { method: "GET", path: "/api/achievement-types/{id:int}", controller: "AchievementTypes", action: "Get" },
  AchievementStatus_Update: { method: "POST", path: "/api/AchievementStatus/update", controller: "AchievementStatus", action: "Update" },
  AchievementTypeGroups_Get: { method: "POST", path: "/api/AchievementTypeGroups", controller: "AchievementTypeGroups", action: "Get" },
  AllApplications_Get: { method: "POST", path: "/api/AllApplications", controller: "AllApplications", action: "Get" },
  ApplicantDisciplines_GetDisciplines: { method: "GET", path: "/api/ApplicantDisciplines/{id}", controller: "ApplicantDisciplines", action: "GetDisciplines" },
  Applicants_GetById: { method: "GET", path: "/api/Applicants/{id}", controller: "Applicants", action: "GetById" },
  ApplicantsChart_Build: { method: "POST", path: "/api/applicants/chart/build", controller: "ApplicantsChart", action: "Build" },
  ApplicantsChart_GetPKs: { method: "POST", path: "/api/applicants/chart/helpers/PKs", controller: "ApplicantsChart", action: "GetPKs" },
  Applicants_GetSummary: { method: "POST", path: "/api/Applicants/summary", controller: "Applicants", action: "GetSummary" },
  ApplicantsRanking_GetRankedByDirection: { method: "POST", path: "/api/ApplicantsRanking/{okso}", controller: "ApplicantsRanking", action: "GetRankedByDirection" },
  AppShort_Get: { method: "POST", path: "/api/AppShort", controller: "AppShort", action: "Get" },
  Customers_Get: { method: "POST", path: "/api/Customers", controller: "Customers", action: "Get" },
  DbMetadata_GetDatabases: { method: "GET", path: "/api/DbMetadata/databases", controller: "DbMetadata", action: "GetDatabases" },
  DbMetadata_GetRecruitmentYears: { method: "GET", path: "/api/DbMetadata/recruitment-years/{database?}", controller: "DbMetadata", action: "GetRecruitmentYears" },
  Disciplines_Get: { method: "POST", path: "/api/Disciplines", controller: "Disciplines", action: "Get" },
  DocumentShorts_Get: { method: "POST", path: "/api/DocumentShorts", controller: "DocumentShorts", action: "Get" },
  DocumentStatus_UpdateDocumentStatus: { method: "POST", path: "/api/DocumentStatus/update", controller: "DocumentStatus", action: "UpdateDocumentStatus" },
  DocumentTypes_Get: { method: "POST", path: "/api/DocumentTypes", controller: "DocumentTypes", action: "Get" },
  ExamInfo_Get: { method: "POST", path: "/api/ExamInfo", controller: "ExamInfo", action: "Get" },
  ExamTypes_Get: { method: "POST", path: "/api/ExamTypes", controller: "ExamTypes", action: "Get" },
  Messages_GetApplicantFull: { method: "POST", path: "/api/Messages/applicant/{id}", controller: "Messages", action: "GetApplicantFull" },
  Messages_GetMessages: { method: "POST", path: "/api/Messages/list", controller: "Messages", action: "GetMessages" },
  PaymentEntries_Get: { method: "POST", path: "/api/PaymentEntries", controller: "PaymentEntries", action: "Get" },
  Roles_Get: { method: "POST", path: "/api/Roles", controller: "Roles", action: "Get" },
  SpecialtyCenters_Get: { method: "POST", path: "/api/SpecialtyCenters", controller: "SpecialtyCenters", action: "Get" },
  StudentStatuses_Get: { method: "POST", path: "/api/StudentStatuses", controller: "StudentStatuses", action: "Get" },
  Users_Get: { method: "POST", path: "/api/Users", controller: "Users", action: "Get" },
} as const satisfies Record<string, ApiEndpoint>;

export type ApiEndpointKey = keyof typeof API_ENDPOINTS;

export interface ApiErrorResponse {
  success?: false;
  message: string;
  [key: string]: unknown;
}

export interface ApiSuccessResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  message?: string;
}

export interface DevExtremeLoadResult<TItem = unknown> {
  data: TItem[];
  totalCount?: number;
  groupCount?: number;
  summary?: unknown;
}

export interface ApiDevExtremeResponse<TItem = unknown> extends ApiSuccessResponse<TItem[]> {
  totalCount?: number;
  groupCount?: number;
  summary?: unknown;
}

export interface AbitSpisokAbitGridRowDto {
  Id: number;
  ApplicationCode: number | null;
  FullName: string | null;
  LastName: string | null;
  FirstName: string | null;
  MiddleName: string | null;
  Email: string | null;
  Mobile: string | null;
  LevelName: string | null;
  Filials: string | null;
  ApplicationStatus: string | null;
  RecruitmentYear: number | null;
}

export interface AbitDocumentsFileContentResponseDto {
  success: boolean;
  fileId: number;
  fileGuid: GuidString;
  fileExt: string | null;
  fileCaption: string | null;
  fileContent: string;
  message: string;
}

export interface DbMetadataDatabasesDto {
  Databases: string[];
  IP: string;
}

export interface ApplicantsChartBuildRequestDto {
  TypeCnn: number;
  StartDate: IsoDateString;
  EndDate: IsoDateString;
  Years: number[];
  PK?: string[] | null;
  Levels?: string[] | null;
  States?: string[] | null;
}

export interface ApplicantsChartPKRequestDto {
  Years: number[];
  Levels?: string[] | null;
  States?: string[] | null;
}

export interface ApplicantsChartSeriesPointDto {
  Argument: string;
  Value: number;
}

export interface ApplicantsChartSeriesByYearDto {
  Year: number;
  Series: ApplicantsChartSeriesPointDto[];
}

export interface ApplicantsChartPKResponseDto {
  PKs: string[];
}

export interface AchievementStatusResultDto {
  status: string;
}

export interface ApplicantSummaryDto {
  Id: number;
  ApplicationCode: number | null;
  FullName: string | null;
  LastName: string | null;
  FirstName: string | null;
  MiddleName: string | null;
  Email: string | null;
  Mobile: string | null;
  PK: string | null;
  SpecialtyName: string | null;
  Faculty: string | null;
  EducationForm: string | null;
  Original: boolean | null;
  Enrolled: boolean | null;
  Status: number | null;
  ContractNumber: string | null;
  ContractDate: IsoDateString | null;
  Company: string | null;
  GUID: GuidString | null;
  ApplicationStatus: string | null;
  StudentStatus: string | null;
  RecruitmentYear: number | null;
  Priority: number | null;
  AvgAttestatScore: number | null;
  OriginalType: string | null;
  Agreement: boolean | null;
  AdditionalSet: boolean | null;
  BenefitType: number | null;
  LearningConditions: string | null;
  PlanNabora: string;
  ScoreSum: number;
  AvgEge: number;
  Total: number;
  ConsentFilesCount: number;
  GreenWaveFilesCount: number;
  ReductionFilesCount: number;
  BallId: number;
  Costs: string | null;
  Sum: string | null;
}

export interface ApiEndpointContract<TRequest = unknown, TResponse = unknown> {
  request: TRequest;
  response: TResponse;
}

export interface ApiEndpointContracts {
  AbitAchievements_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<AbitAchievementDto>
  >;
  AbitAchievements_GetByAbitId: ApiEndpointContract<
    { path: { abitId: number } },
    ApiSuccessResponse<AbitAchievementDto[]>
  >;
  AbitDisciplinesFast_GetApplicants: ApiEndpointContract<
    {
      path: { disciplineId: number };
      query: { examType: number; inGroup: boolean; year?: number };
      body: DevExtremeLoadOptions;
    },
    ApiDevExtremeResponse<ApplicantFastDto>
  >;
  AbitDisciplinesFast_GetDisciplines: ApiEndpointContract<
    { query?: { year?: number }; body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<DisciplineFastDto>
  >;
  AbitDocuments_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<AbitDocumentDto>
  >;
  AbitDocuments_GetByAbitId: ApiEndpointContract<
    { path: { abitId: number } },
    ApiSuccessResponse<AbitDocumentDto[]>
  >;
  AbitDocuments_GetFileContent: ApiEndpointContract<
    { path: { fileId: number; fileGuid: GuidString } },
    AbitDocumentsFileContentResponseDto | ApiErrorResponse | string
  >;
  AbitExamComputed_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<AbitExamComputedDto>
  >;
  AbitMarks_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<AbitMarkDto>
  >;
  AbitScreen_GetScreen: ApiEndpointContract<
    { query: { year: number }; body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<AbitScreenDto>
  >;
  AbitScreen_GetRank: ApiEndpointContract<
    {
      query: {
        year: number;
        specialtyCode: number;
        eduFormCode: number;
        trainingType: number;
        consentMode: number;
      };
      body: DevExtremeLoadOptions;
    },
    ApiDevExtremeResponse<AbitScreenRankDto>
  >;
  AbitSpisokAbit_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    DevExtremeLoadResult<AbitSpisokAbitGridRowDto>
  >;
  AbitSpisokAbit_GetDistinct: ApiEndpointContract<
    { query: { year: number }; body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<AllApplicantFullDto>
  >;
  AchievementTypes_GetAll: ApiEndpointContract<
    Record<string, never>,
    ApiSuccessResponse<AchievementTypeDto[]>
  >;
  AchievementTypes_Get: ApiEndpointContract<
    { path: { id: number } },
    ApiSuccessResponse<AchievementTypeDto>
  >;
  AchievementStatus_Update: ApiEndpointContract<
    { body: AchievementStatusUpdateDto },
    ApiSuccessResponse<AchievementStatusResultDto>
  >;
  AchievementTypeGroups_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<AchievementTypeGroupDto>
  >;
  AllApplications_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<AllApplicationDto>
  >;
  ApplicantDisciplines_GetDisciplines: ApiEndpointContract<
    { path: { id: number } },
    ApiSuccessResponse<ApplicantDisciplineDto[]>
  >;
  Applicants_GetById: ApiEndpointContract<
    { path: { id: number } },
    ApiSuccessResponse<AbitSpisokAbitDto>
  >;
  ApplicantsChart_Build: ApiEndpointContract<
    { body: ApplicantsChartBuildRequestDto },
    ApiSuccessResponse<ApplicantsChartSeriesByYearDto[]>
  >;
  ApplicantsChart_GetPKs: ApiEndpointContract<
    { body: ApplicantsChartPKRequestDto },
    ApiSuccessResponse<ApplicantsChartPKResponseDto>
  >;
  Applicants_GetSummary: ApiEndpointContract<
    {
      query?: { consent?: boolean; moreThanOne?: boolean };
      body: DevExtremeLoadOptions;
    },
    ApiDevExtremeResponse<ApplicantSummaryDto>
  >;
  ApplicantsRanking_GetRankedByDirection: ApiEndpointContract<
    {
      path: { okso: string };
      query?: {
        eduForm?: number;
        company?: string;
        year?: number;
        facultyCode?: number;
        priority?: number;
        withoutExam?: number;
        pp?: string;
        region?: string;
        dormitory?: string;
        pk?: string;
        planNabora?: number;
        onlyAccepted?: boolean;
        rs?: boolean;
        rswithsogl?: boolean;
      };
      body: DevExtremeLoadOptions;
    },
    ApiDevExtremeResponse<ApplicantRankingDto>
  >;
  AppShort_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<ApplicationShortDto>
  >;
  Customers_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<CustomerDto>
  >;
  DbMetadata_GetDatabases: ApiEndpointContract<
    { query: { role: string } },
    ApiSuccessResponse<DbMetadataDatabasesDto>
  >;
  DbMetadata_GetRecruitmentYears: ApiEndpointContract<
    { path?: { database?: string }; query: { role: string } },
    ApiSuccessResponse<number[]>
  >;
  Disciplines_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<DisciplineDto>
  >;
  DocumentShorts_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<DocumentShortDto>
  >;
  DocumentStatus_UpdateDocumentStatus: ApiEndpointContract<
    { body: DocumentStatusUpdateDto },
    ApiSuccessResponse<Record<string, unknown>>
  >;
  DocumentTypes_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<DocumentTypeDto>
  >;
  ExamInfo_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<AbitExamInfoDto>
  >;
  ExamTypes_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<ExamTypeDto>
  >;
  Messages_GetApplicantFull: ApiEndpointContract<
    { path: { id: number }; body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<ApplicantFullDto>
  >;
  Messages_GetMessages: ApiEndpointContract<
    { query: { withoutReply: boolean }; body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<MessageRowDto>
  >;
  PaymentEntries_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<PaymentEntryDto>
  >;
  Roles_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<RoleInfoDto>
  >;
  SpecialtyCenters_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<SpecialtyCenterDto>
  >;
  StudentStatuses_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<StudentStatusDto>
  >;
  Users_Get: ApiEndpointContract<
    { body: DevExtremeLoadOptions },
    ApiDevExtremeResponse<UserInfoDto>
  >;
}

export type ApiEndpointRequest<K extends ApiEndpointKey> = ApiEndpointContracts[K]["request"];
export type ApiEndpointResponse<K extends ApiEndpointKey> = ApiEndpointContracts[K]["response"];
