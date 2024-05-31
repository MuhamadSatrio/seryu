import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Op } from 'sequelize';

dotenv.config();

interface UserData  {
	name: string | null
	email: string | null
	roleId: string | null
	verified: boolean | null
	active:boolean | null
}

const ResponseData = (status: number, message: string | null, error: any | null, data: any | null) => {
	if (error != null && error instanceof Error) {
		const response = {
			status: status,
			message: error.message,
			errors: error,
			data: null
		}

		return response;
	}

	const res = {
		status,
		message,
		errors: error,
		data: data
	};

	return res;
};

const GenerateToken = (data: any): string => {
	const token = jwt.sign(data, process.env.JWT_TOKEN as string, { expiresIn: "30d" });

	return token;
}

const GenerateRefreshToken = (data: any): string => {
	const token = jwt.sign(data, process.env.JWT_REFRESH_TOKEN as string, { expiresIn: "1d" });

	return token;
}

const ExtractToken = (token: string): UserData | null => {
	const secretKey: string = process.env.JWT_TOKEN as string;

	let resData: any;

	const res = jwt.verify(token, secretKey, (err, decoded) => {
		if (err) {
			resData = null
		} else {
			resData = decoded
		}
	});

	if (resData) {
		const result: UserData = <UserData>(resData);
		return result;
	}
	return null;
}

const ExtractRefreshToken = (token: string): UserData | null => {
	const secretKey: string = process.env.JWT_REFRESH_TOKEN as string;

	let resData: any;

	const res = jwt.verify(token, secretKey, (err, decoded) => {
		if (err) {
			resData = null
		} else {
			resData = decoded
		}
	});

	if (resData) {
		const result: UserData = <UserData>(resData);
		return result;
	}
	return null;
}

const applyFilter = (params: Record<string, any>) => {
    const filter: Record<string, any> = {};

    // Cek apakah hanya ada satu parameter yang diberikan
    if (Object.keys(params).length === 1) {
        const key = Object.keys(params)[0];
        filter[key] = { [Op.like]: `%${params[key]}%` };
    } else {
        Object.keys(params).forEach(key => {
            filter[key] = { [Op.like]: `%${params[key]}%` };
        });
    }

    return filter;
}

export default { ResponseData, GenerateToken, GenerateRefreshToken, ExtractToken, ExtractRefreshToken, applyFilter };