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
        const res =await axios({
            method: "GET",
            url: "https://api.intra.42.fr/v2/me",
            headers: {
              authorization: `Bearer ${access_token}`,
              "content-type": "application/json",
            }
        });
        return (await res).data;
    } catch (error) {
        return error;   
        console.log("invaliddd!");
        
    }
}

export async function googleOauthHandler(req: any, res : Response) 
{
    try 
    {
		
        const code  = req.query.code as string
        const {id_token,access_token} = await getGoogleOauthTokens( {code : code})
        //console.log(access_token);
        
        const user = await getGoogleUser(id_token,access_token);
        //console.log(user);
        
        return res.status(200).send(user)
        
    } catch (error) {
        //console.log("error");
        
        return res.status(400).send(error);
    }


}

export async function getGoogleOauthTokens({code}:{code : string}):Promise<GoogleTockenResult>
{
    /*
     const url = 'https://oauth2.googleapis.com/token'
    
    const values = {
        code,
        client_id: "u-s4t2ud-ba3aea4480c6fd2f33eb1c38078b70eb56bfc32316df9eed3ce24c731b6b48c1",
        client_secret: "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",
        redirect_uri: 'http://localhost:3000/ft_auth',
        grant_type: 'client_credentials,
        // code:code,
    };
    
    */
    const values = {
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.SECRET_KEY,
        redirect_uri:process.env.REDIRECT_URI,
        grant_type: 'authorization_code',
        // code:code,
    };

    
    
    const client_id = "u-s4t2ud-ba3aea4480c6fd2f33eb1c38078b70eb56bfc32316df9eed3ce24c731b6b48c1" as string
    const secret_key = "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" as string
    const url = 'https://api.intra.42.fr/oauth/token';
    const data = `grant_type=client_credentials&client_id=${client_id}&client_secret=${secret_key}`;

    try {
      const response = await axios.post(url, values);
      //console.log(response.data);
      
      return response.data;
    } catch (error) {
      // Handle error appropriately
      console.error(error);
      throw new Error('Failed to retrieve token');
    }
}
