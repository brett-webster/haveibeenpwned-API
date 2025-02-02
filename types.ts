export interface BreachType {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  ModifiedDate: string;
  PwnCount: number;
  Description: string;
  LogoPath: string;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
  IsMalware: boolean;
  IsSubscriptionFree: boolean;
}

export interface QueryParamType {
  email?: string;
}

export interface DataRowType {
  name: string;
  domain: string;
  breachDate: string;
  userName: string;
  password: string;
}

export interface ColumnMeta {
  index: number;
  label: string;
}

export type HandleToggleColumn = (index: number) => void;

//   -----------

// BreachType EXAMPLE ---> https://haveibeenpwned.com/API/v3#BreachModel
// {
// "Name": "Adobe",
// "Title": "Adobe",
// "Domain": "adobe.com",
// "BreachDate": "2013-10-04",
// "AddedDate": "2013-12-04T00:00:00Z",
// "ModifiedDate": "2022-05-15T23:52:49Z",
// "PwnCount": 152445165,
// "Description": "In October 2013, 153 million Adobe accounts were breached with each containing an internal ID, username, email, encrypted password and a password hint in plain text. The password cryptography was poorly done and many were quickly resolved back to plain text. The unencrypted hints also <a href="http://www.troyhunt.com/2013/11/adobe-credentials-and-serious.html" target="_blank" rel="noopener">disclosed much about the passwords</a> adding further to the risk that hundreds of millions of Adobe customers already faced.",
// "LogoPath": "https://logos.haveibeenpwned.com/Adobe.png",
// "DataClasses": [
//   "Email addresses",
//   "Password hints",
//   "Passwords",
//   "Usernames"
// ],
// "IsVerified": true,
// "IsFabricated": false,
// "IsSensitive": false,
// "IsRetired": false,
// "IsSpamList": false,
// "IsMalware": false,
// "IsSubscriptionFree": false
// }
