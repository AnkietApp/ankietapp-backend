# ankietapp-backend

## Description
Backend for the survey management app "ankietApp"

## Entity Relationship Diagram
![erd-survey](/erd-survey.jpg)

## Technologies
- Mailgun integration ✅
- TypeScript ✅
- TypeORM ✅
- MySQL ✅
- cron (schedule sending email notifications) ✅

## Requirements
- Node.js
- MySQL
- Mailgun account and private key

## Install
Create database
```
mysql> CREATE DATABASE ankietApp;
```
Install typescript
```
$ npm install -g typescript
```
Install dependencies
```
$ npm install
```
Run app (PORT 8080)
```
$ npm run dev
```
Go to http://localhost:8080
