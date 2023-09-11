import { Controller, Get, UseGuards } from "@nestjs/common";
import { GoogleGuard } from "./utils/Guard";

@Controller('auth')
export class AuthController{
    @Get('google/login')
    @UseGuards(GoogleGuard)
    handleLogin()
    {
        console.log("Get /google/login");
        return({msg: 'logging in...'})
    }
    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    handleRedirect()
    {
        console.log("Get /google/redirect");
        
        return({msg: 'google redirect complete' })
    }
}