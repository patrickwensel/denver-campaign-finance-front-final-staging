import { Injectable } from '@angular/core';

@Injectable()
export class MasterUrlService {
  constructor() { }


  loginUrl = 'api/UserManagement/Authenticate';
  getUserDetailUrl = 'api/UserManagement/GetLoggedInUserInfo';

  // API Token getting details
  grantType = 'password';
  clientId = 'ro.client';
  clientSecret = 'secret';
  scope = 'api1';
  TokenUrl = '/identityServer/connect/token';
 //User Management
 createCoe = 'api/Committee/createCoveredOfficials?contactId=';
 CreateContactInformation = 'api/UserManagement/CreateContactInformation';
 loginInformation = 'api/UserManagement/LoginInformation';
 committeeGetList = 'api/LookUp/getLookUps';
 ballotInformation = 'api/Committee/ballotissue/getList';
 lookupGetList ='api/LookUp/getLookUps'
 getallUserType = 'api/UserManagement/GetAllUserType';
 getFilerTypes = 'api/LookUp/getLookUps?lookUpTypeCode=';
 chooseUserType = 'api/UserManagement/ChooseUserType';
 committeeInformation = 'api/committee/createDetails';
 committeeContactCreate= 'api/Committee/createCommittee';
 createSmallDonorCommittee ='api/Committee/createSmallDonorCommittee';
 createPACCommittee ='api/Committee/createPACCommittee';
 createIssueCommittee ='api/Committee/createIssueCommittee';
 updateBankInfo ='api/Committee/updateBankInfo';
 deleteOfficer = 'api/Committee/DeleteOfficer?contactid=';
 lobbyistInformation ='api/Lobbyist/createLobbyist';
 iefAdditionalInfo = 'api/UserManagement/UpdateIEFAdditionalInfo';
 confirmSubmit = 'api/UserManagement/GetUserAccountConfirmAndSubmit';
 getLobbyID = 'api/Lobbyist/GetLobbyist';
getClients ='api/Lobbyist/Getclient';
validateEmailCheck ='api/UserManagement/VaidateEmailCheck?UserEmailID=';
 //Committee
 committeeList = 'api/Committee/getListByName';
 committeeAditionalInfo = 'api/committee/UpdateCommitteeAdditionalInfo';
 committeeByName = 'api/Committee/GetCommitteeByName';
 saveCommitteeAffiliation = 'api/Committee/SaveCommitteeAffiliation';
getElectionDates =  'api/LookUp/getElectionDates';
//   //Logout
//   logout = '/ClientPortal/api/AdminManagement/LogoutStatusUpdate';

//Contact
createAccount = 'api/Contact/createContact';
contributorContact = 'api/Contact/getLendersPayersContributerContacts?entityId='
getContactDetailsById = 'api/Contact/getContactDetailsById?contactId='
 //Committee Office
 getStatelist = 'api/common/state/getList';
 getStatusList = 'api/LookUp/getStatusList';
 getOfficerTypeList = 'api/LookUp/getLookUps';
 getAllOfficeList = 'api/LookUp/getLookUps?lookUpTypeCode=OFF';
 getList = 'api/LookUp/getLookUps';
 getCommitteeList = 'api/Committee/getList';
 getOfficeSearchByName = 'api/Committee/GetOfficersListByName?officerName=';
 getCommitteeDetails = 'api/Committee/GetCommitteeDetail';
 getManageCommitteeList = 'api/UserManagement/GetManageFilerDetail';
 downloadCSV = 'api/Committee/DownloadManageFilerList';
//  api/UserManagement/GetManageFilerDetail
//lobbyist
lobbyList = 'api/Lobbyist/GetLobbyist';
updatelobbyList = 'api/Lobbyist/UpdateLobbyistAdditionalInfo';
lobbyListDetails = 'api/Lobbyist/GetLobbyistDetail?lobbyistId=';
lobbyEntities = 'api/Lobbyist/getLobbyistEntities?lobbyistId=';
updateLobbyistStatus = 'api/Lobbyist/UpdateLobbyistStatus';
updateCommitteeorLobbyistStatus = 'api/Committee/UpdateCommitteeorLobbyistStatus';
saveLobbyistAffiliation = 'api/Lobbyist/SaveLobbyistAffiliation';
getlobbyByName = 'api/Lobbyist/GetLobbyistByName?searchLobbyName=';

//Indipendent expenduture
indipendentList = 'api/UserManagement/GetIndependentSpender';

// auth APIs
login = 'api/UserManagement/Authenticate';
resetPassword = 'api/UserManagement/ResetPassword';
forgotPassword = 'api/UserManagement/ForgotPassword';

//System Management
createBallot = 'api/SystemManagement/CreateBallotIssues';
getBallot = 'api/SystemManagement/GetBallotIssuesList';
updateBallotIssue = 'api/SystemManagement/UpdateBallotIssues';
deleteBallotIssue = 'api/SystemManagement/DeleteBallotIssues';
createContribution = 'api/SystemManagement/CreateContributionLimits';
updateContribution = 'api/SystemManagement/UpdateContributionLimits';
deleteContribution = 'api/SystemManagement/DeleteContributionLimits';
getContribution = 'api/SystemManagement/GetContributionLimitsList';
getFilerTypeList = 'api/SystemManagement/GetFillerTypeList';
getDonorTypeList = 'api/SystemManagement/GetDonorTypeList';
getOfficeTypeList = 'api/SystemManagement/GetOfficeTypeList';
getElectionList = 'api/SystemManagement/GetElectionList';
addCommitteeType = 'api/SystemManagement/SaveCommitteType';
updateCommitteeType = 'api/SystemManagement/UpdateCommitteType';
deleteCommitteeType = 'api/SystemManagement/DeleteCommitteeType';
getCommitteTypeList = 'api/SystemManagement/GetCommitteTypeList';
addOffice = 'api/SystemManagement/SaveOffice';
updateOffice = 'api/SystemManagement/UpdateOffice';
deleteOffice = 'api/SystemManagement/DeleteOffice';
getallOfficeList = 'api/SystemManagement/GetallOfficeList';
GetLookUpTypeList = 'api/LookUp/GetLookUpTypeList';
addMatchingLimits = 'api/SystemManagement/AddMatchingLimits';
updateMatchingLimits = 'api/SystemManagement/UpdateMatchingLimits';
deleteMatchingLimits = 'api/SystemManagement/DeleteMatchingLimits';
getMatchingLimitsList = 'api/SystemManagement/GetMatchingLimitsList';
createModifyForm = 'api/SystemManagement/CreateModifyFormImageUpload';
updateModifyForm = 'api/SystemManagement/UpdateModifyFormImageUpload';
permissionList = 'api/SystemManagement/GetUserPermissionList';
getCommitteeListBallot = 'api/SystemManagement/GetCommiteeListMatchingBallotCode';
getModifyForms = 'api/SystemManagement/GetModifyFormImage';

// Switch Committee
// CommitteeLobbyList = 'api/Committee/GetCommitteeandLobbyistbyUser?id=';
CommitteeLobbyList = 'api/Committee/GetCommitteeandLobbyistbyUser?id=';
CommitteeLobbyDetail = 'api/Committee/GetCommitteeorLobbyistbyID?id=';
getCommiteeDetail = 'api/Committee/GetOfficersList?committeeid=';
getUserEntityDetails = 'api/UserManagement/getUserEntityDetails';
getcommitteeDetails = 'api/Committee/GetCommitteeDetails?committeeid=';
CommitteeDetail = 'api/UserManagement/getUserEntityDetails?entityId=';
CurrentUserList = 'api/UserManagement/GetFilerUsers';
deleteCurrentUser = 'api/UserManagement/DeleteFilerContact';
makeUserTreasurer = 'api/UserManagement/SaveMakeTreasurer';
addCurrentUser = 'api/UserManagement/FilerInviteUser';
LobbyistDetail = 'api/Committee/GetSwitchLobbyistDetails?id=';
lobbyistContactInformation = 'api/Lobbyist/getLobbyistContactInformation';
IEDetail = 'api/Committee/GetSwitchIEDetails?id=';
getLobbyDetails = 'api/Lobbyist/GetLobbyistDetail?lobbyistId=';

// Send / Join APIs
sendCommittee = 'api/Committee/SendCommittee';
sendLobbyist = 'api/Lobbyist/SendLobbyist';
// sendIE = 'api/UserManagement/SendIndependentSpender';
sendIE = 'api/UserManagement/SaveIndependentSpenderAffiliation';
// saveIE = 'api/UserManagement/UpdateIEFAdditionalInfo';
saveIE = 'api/UserManagement/UpdateIEAdditionalInfo';

//manage Committee
updateCommitteeStatus='api/Committee/UpdateCommitteeStatus';
// getSearchList = 'api/Committee/getListByName';
getsearchFilter = 'api/UserManagement/getFilerNamesByName'

//UserManagement
getManageFilerDetail='api/UserManagement/GetManageFilerDetail';
getManageFiler = 'api/UserManagement/getManageFilers';
getLookUps = 'api/LookUp/getLookUps?lookUpTypeCode='
getElectionData ='api/LookUp/getElectionDates';
getCommitteeListAll ='api/Committee/GetCommitteeByName';
getLookUpStateList ='api/LookUp/getStatesList';

// officer
getOfficerTableList = 'api/Committee/GetOfficersList?committeeid=';
saveOfficer = 'api/Committee/SaveOfficer';
updateIef='api/UserManagement/UpdateIEAdditionalInfo';
//lookUp
getLookUpTypeList='api/LookUp/getLookUps?lookUpTypeCode=';
getStatesList='api/LookUp/GetStatesList';

//Lobbyist
saveLobbyist = 'api/Lobbyist/saveLobbyist';
//getStatesList='api/LookUp/GetStatesList';
getLookuplist = 'api/LookUp/getLookUps?lookUpTypeCode=';
getEmployeeLobbyist = 'api/Lobbyist/getLobbyistEntities';
getEmployeeLobbyistSearch = 'api/Lobbyist/getLobbyistEntitiesbyName';
getLobbiestById='api/Lobbyist/GetLobbyist?lobbyistId=';
deleteEmployee = 'api/Lobbyist/deleteEmployee?contactId=';
deleteClient = 'api/Lobbyist/deleteClient?contactId=';
deleteRelationship = 'api/Lobbyist/deleteRelationship?contactId=';
deleteSubcontractor = 'api/Lobbyist/deleteSubcontractor?contactId=';
saveEmployee = 'api/Lobbyist/saveEmployee';
saveClient = 'api/Lobbyist/saveClient';
saveRelationship = 'api/Lobbyist/saveRelationship';
saveSubcontractor = 'api/Lobbyist/saveSubcontractor';
//getLookuplist = 'api/LookUp/GetLookUpTypeList';
getLobbyist ='api/Lobbyist/GetLobbyist';
// saveClient ="api/Lobbyist/saveClient";
// saveRelationship ='api/Lobbyist/saveRelationship';
getSearchLobbyist = 'api/Lobbyist/getLobbyistEntitiesbyName';

//calendar
saveElectionCycle = 'api/Calendar/saveElectionCycle';
deleteElectionCycle = 'api/Calendar/deleteElectionCycle?electionCycleId=';
getElectionCycleById = 'api/Calendar/getElectionCycleById?electionCycleId=';
getElectionCycle = 'api/Calendar/getElectionCycles';
saveEvents = 'api/Calendar/SaveEvents';
deleteEvents = 'api/Calendar/DeleteEvents?eventId=';
getEvents = 'api/Calendar/GetEvents';
saveFilingPeriod = 'api/Calendar/SaveFilingPeriod';
deleteFilingPeriod = 'api/Calendar/DeleteFilingPeriod';
getFilingPeriods = 'api/Calendar/GetFilingPeriods';
getFilingPeriodsById = 'api/Calendar/GetFilingPeriodById?filingperiodid=';
getEventsById = 'api/Calendar/GetEventsById?eventId=';

//signatue
saveSignature = 'api/Lobbyist/UpdateLobbyistSignature';
//switchCommittee
getUserEntities = 'api/UserManagement/getUserEntites';
getUserEntitiesDetails = 'api/UserManagement/getUserEntityDetails';
getCommiteesListNew = 'api/Committee/GetCommitteeByName';
addCommitteeAffiliation = 'api/Committee/SaveCommitteeAffiliation';
addLobbyistAffiliation = 'api/Lobbyist/SaveLobbyistAffiliation';

//Calendar API's
getCalendarList = 'api/Calendar/getCalendarEvents?';

latefine = 'api/Payments/SaveFine';
deleteFine = 'api/Payments/DeleteFine';
getFines = 'api/Payments/GetFines';
addfees = 'api/Payments/SaveFees';
getfees = 'api/Payments/GetFees';
deleteFees = 'api/Payments/DeleteFees';

// paymenyts and Waivers
getOustandingSummary = 'api/Payments/GetOutStandingFeeSummary?filerid=';
getOutstandingGrid = 'api/Payments/GetInvoices?filerid=';
updateStatus = 'api/Payments/UpdateInvoiceStatus';
getFilerInvoices = 'api/Payments/GetFilerInvoices';
getFilerOutstandingFees = 'api/Payments/GetFilerOutStandingFeeSummary';
savePenalty = 'api/Payments/SavePenalty';
saveTransaction = 'api/Payments/SaveTransaction';
getpaymentHistory = 'api/Payments/getPaymentHistory';
dwnldPaymentHistory = 'api/Payments/DownloadPaymentHistory';
getInvoiceFromId = 'api/Payments/GetInvoiceInfoFromId?invoiceid=';
getFilerPaymentHistory = 'api/Payments/getFilerPaymentHistory?filerId=';
getEntityPaymentHistory = 'api/Payments/getEntityPaymentHistory';
// Transaction
saveContribution = 'api/Transaction/saveContribution'


//transactions-loan
saveLoan = 'api/Transaction/SaveLoan';
saveExpenditure = 'api/Transaction/saveExpenditure'
saveUnpaidObligation = 'api/Transaction/saveUnpaidObligation';
}

