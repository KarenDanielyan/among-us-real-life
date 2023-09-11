import axios from "axios";
import qs from 'qs'
import oauthConfig from "../config/default"
import { application, query } from "express";
import { Query, Res } from "@nestjs/common";
import { json } from "stream/consumers";
import { access } from "fs";
import { Response } from "express";
import * as jwt from 'jsonwebtoken'

interface GoogleUserResult
{
    id:string;
    email:string;
    verified_email:boolean;
    name:string;
    given_name:string;
    picture:string;
    locale:string;
}

interface GoogleTockenResult
{
    access_token:string;
    expire_in:Number;
    refresh_token:string;
    scope:string;
    id_token:string;
}

export async function findAndUpdate() {
    
}

export async function getGoogleUser(id_token,access_token):Promise<GoogleUserResult>
{
    try {
        const res = axios.get<GoogleUserResult>(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,{
            headers:{
                Authorization:`Bearer ${id_token}`
            }
        })
        return (await res).data;
    } catch (error) {
        console.log(error.message,"invaliddd!");
        
    }
}

export async function googleOauthHandler(req: any, res : Response) 
{
    try 
    {
		
        const code  = req.query.code as string
        const {id_token,access_token} = await getGoogleOauthTokens( {code : code})
        const user = await getGoogleUser(id_token,access_token);
        console.log(user);
        
        return res.send(user)
        
    } catch (error) {
        return res.status(500).send(error);
    }


}

export async function getGoogleOauthTokens({code}:{code : string}):Promise<GoogleTockenResult>
{
    const url = 'https://oauth2.googleapis.com/token'
    
    const values = {
        code,
        client_id:process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
        // code:code,
    };
    try{
       // console.log('hayvaaaaannnn',qs.stringify(values));
        //return {msg : 'maybe ok'}
        
        const res = await axios.post<GoogleTockenResult>(url,values,
        {
            headers:{
                
                'Content-Type': 'application/json',
            },
        });
        // console.log("dsdsdsdssds",await res.data);
        
        return res.data
    }catch(error:any){
		return error.response
        //console.log(error.response,'failedddd!');
        // throw new Error(error.message);
        
    }
}
