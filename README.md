# ankietapp-backend

## Description
Backend for the survey management app "ankietApp"

## Features
- As an administrator there is a possibility to create survey and assign users as a respondents to them
- Each survey has multiple questions and set due date. 
- Each question has one of the types: date, text, single choice, multiple choice
- Every time survey is created, each respondent will be asked via email to fill survey (using Mailgun integration). If survey is public then each user in the system will be asked to fill survey
### Example of survey creation
img

## Entity Relationship Diagram
![erd-survey](/erd-survey.jpg)

## Technologies
- Mailgun integration ✅
- TypeScript ✅
- TypeORM ✅
- MySQL ✅
- Passport.js (JWT authorization) ✅
- cron (schedule sending email notifications) ✅

## Requirements
- Node.js
- MySQL
- Mailgun account and private key

## Install
1. Create database
```
mysql> CREATE DATABASE ankietApp;
```
2. Install typescript
```
$ npm install -g typescript
```
3. Install dependencies
```
$ npm install
```
4. Create .env from example.env then set MAILGUN_API_KEY and MAILGUN_DOMAIN  
5. Run app (PORT 8080)
```
$ npm run dev
```
Go to http://localhost:8080
