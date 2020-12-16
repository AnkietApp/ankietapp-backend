/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable import/prefer-default-export */
import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { asBlob } from 'html-docx-js-typescript'

import Survey from '../entity/Survey';
import Question from '../entity/Question';
import Choice from '../entity/Choice';
import User from '../entity/User';
import UserSurveyResponse from '../entity/UserSurveyResponse';
import Answer from '../entity/Answer';

export const getReport = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    // const user = (<any>req).user
    try
    {
        
        const survey = await getRepository(Survey)
        .createQueryBuilder('survey')
        .select()
        .where('survey.id = :surveyId')
        .setParameters({
            surveyId: req.params.id
        }).getOne();

        const responses = await getRepository(UserSurveyResponse)
        .createQueryBuilder('userSurveyResponse')
        .select()
        .where('surveyId = :surveyID')
        .setParameters({
            surveyID: req.params.id
        }).getMany();

        const questions = await getRepository(Question)
        .createQueryBuilder('userSurveyResponse')
        .select()
        .where('surveyId = :surveyID')
        .setParameters({
            surveyID: req.params.id
        }).getMany();
        const qnum = questions.length;

        //Generate report data
        let html = "<html><head><meta charset=\"UTF-8\"><style>table,th,td{border: 1px solid black; border-collapse: collapse; text-align:center;}</style></head><body><h1>Raport z ankiety: ";
        html += `${survey?.name  }.</h1><br>`;
        
        html += '<table style="width: 100%; font-size: 12px;">'

        let labels: {[key:number]:string} = {};
        let types: {[key: number]:string} = {};

        for(const question of questions)
        {
            labels[question.id] = question.description;
            types[question.id] = question.type;
        }

        html += `<tr><td>Email</td>`;
        for(let key in labels)
        {
            html += `<td>${labels[key]}</td>`;
        }
        html += "</tr>"

        // eslint-disable-next-line no-restricted-syntax
        for(const response of responses)
        {
            const respUser = await getRepository(User)
            .createQueryBuilder('user')
            .select()
            .where('user.id = :userId')
            .setParameters({
                userId: response.userId
            }).getOne();

            html += `<tr><td>${ respUser?.email }</td>`;

            if(response.completed === true)
            {
                const answers = await getRepository(Answer)
                .createQueryBuilder('answer')
                .select()
                .where('userSurveyResponseId = :usrId')
                .setParameters({
                    usrId: response.id
                }).getMany();
                let data: {[key: number] : string} = {};
                for(const answer of answers)
                {
                    if(data[answer.questionId] === undefined) data[answer.questionId] = "";
                    if(types[answer.questionId] === "singleChoice" || types[answer.questionId] === "multipleChoice")
                    {
                        const choice = await getRepository(Choice)
                        .createQueryBuilder("choice")
                        .select()
                        .where('id = :cid')
                        .andWhere('questionId = :qid')
                        .setParameters({
                            cid: answer.value,
                            qid: answer.questionId
                        }).getOne();
                        data[answer.questionId] += `${ choice?.value } `;
                    }
                    else
                    {
                        data[answer.questionId] += `${ answer.value } `;
                    }
                }
                for(let key in labels)
                {
                    if(data[key] !== undefined)
                    {
                        html += `<td>${data[key]}</td>`;
                    }
                    else
                    {
                        html += `<td>---</td>`;
                    }
                }
            }
            else
            {
                html += `<td colspan=${qnum}>Brak odpowiedzi</td>`;
            }
            html += "</tr>"
        }

        html += '</table>';

        //Finalize document
        html += "</body></html>";
        let buf = Buffer.from("");
        await asBlob(html).then((data: Buffer) => {
            buf = Buffer.alloc(data.byteLength);
            data.copy(buf,0);
        });
        res.contentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        return res.send(buf);
    }
    catch (err)
    {
        return res.send(err);
    }
}