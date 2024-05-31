import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Driver from "../db/models/Driver";
import ShipmentCost from "../db/models/ShipmentCost";
import Shipment from "../db/models/Shipment";
import Helper from "../helpers/Helper";
import DriverAttendance from '../db/models/DriverAttendance';
import VariableConfig from '../db/models/VariableConfig';

const GetDriver = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { page_size, current, name, driver_code } = req.query as {
            name: string;
            driver_code: string;
            page_size: string;
            current: string;
        };

        const limitNum = parseInt(page_size, 10);
        const pageNum = parseInt(current, 10);
        const offset = (pageNum - 1) * limitNum;

		const filterParams: Record<string, any> = {};
		if (name !== undefined) filterParams.name = name;
        if (driver_code !== undefined) filterParams.driver_code = driver_code;

        // Apply filter
        const filter = Helper.applyFilter(filterParams);

        const drivers = await Driver.findAndCountAll({
            where: filter,
            limit: limitNum,
            offset: offset
        });

        return res.status(200).send({
            status: 200,
            message: 'OK',
            data: drivers.rows,
            total_row: drivers.count,
            current: pageNum,
			page_size : limitNum,
            total_pages: Math.ceil(drivers.count / limitNum)
        });
    } catch (error: any) {
        if (error != null && error instanceof Error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
                errors: error
            });
        }

        return res.status(500).send({
            status: 500,
            message: "Internal server error",
            errors: error
        });
    }
}

interface Totals {
    driver_code: string;
    name: string;
    total_pending: number;
    total_confirmed: number;
    total_paid: number;
    total_attendance_salary: number; 
    total_salary: number; 
    count_shipments: number;
}

const GetDriver2 = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { page_size = '10', current = '1', name, driver_code, month, year } = req.query as {
            [key: string]: string | string[] | undefined;
        };

        const pageSize: number = typeof page_size === 'string' ? parseInt(page_size) : 10;
        const currentPage: number = typeof current === 'string' ? parseInt(current) : 1;
        const filterParams: Record<string, any> = {};
        if (name !== undefined) filterParams.name = name;
        if (driver_code !== undefined) filterParams.driver_code = driver_code;

        const filter = Helper.applyFilter(filterParams);

        const dateFilter: Record<string, any> = {};
        const dateFilter2: Record<string, any> = {};
        if (month && year) {
            const startDate = new Date(`${year}-${month}-01`);
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            dateFilter['shipment_date'] = {
                [Op.between]: [startDate, endDate]
            };
            dateFilter2['attendance_date'] = {
                [Op.between]: [startDate, endDate]
            };
        } else if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${year}-12-31`);
            dateFilter['shipment_date'] = {
                [Op.between]: [startDate, endDate]
            };
            dateFilter2['attendance_date'] = {
                [Op.between]: [startDate, endDate]
            };
        }

        const drivers = await Driver.findAndCountAll({
            where: filter,
            include: [
                {
                    model: ShipmentCost,
                    include: [
                        {
                            model: Shipment,
                            where: dateFilter
                        }
                    ]
                }
            ]
        });

        const driverAttendances = await DriverAttendance.findAndCountAll({
            where: {
                attendance_status: true,
                ...dateFilter2
            }
        });

        const VariableConfigs = await VariableConfig.findOne({
            where: {
                key: 'DRIVER_MONTHLY_ATTENDANCE_SALARY'
            }
        });

        const attendanceMap: { [key: string]: number } = {};
        driverAttendances.rows.forEach((attendance: any) => {
            const driverCode = attendance.driver_code;
            if (!attendanceMap[driverCode]) {
                attendanceMap[driverCode] = 0;
            }
            attendanceMap[driverCode]++;
        });

        const totals: { [key: string]: Totals } = {};

        drivers.rows.forEach((item: any) => {
            const status = item.ShipmentCost?.cost_status ?? "CANCELED";
            const totalCosts = parseFloat(item.ShipmentCost?.total_costs ?? "0");

            if (!totals[item.driver_code]) {
                const sumAttendance = attendanceMap[item.driver_code] || 0;
                totals[item.driver_code] = {
                    driver_code: item.driver_code,
                    name: item.name,
                    total_pending: 0,
                    total_confirmed: 0,
                    total_paid: 0,
                    total_attendance_salary: sumAttendance * (VariableConfigs?.value ?? 0),
                    total_salary: 0,
                    count_shipments: 0,
                };
            }

            if (status !== "CANCELED") {
                totals[item.driver_code].count_shipments++;
            }

            if (status === "PENDING") {
                totals[item.driver_code].total_pending += totalCosts;
            } else if (status === "CONFIRMED") {
                totals[item.driver_code].total_confirmed += totalCosts;
            } else if (status === "PAID") {
                totals[item.driver_code].total_paid += totalCosts;
            }
        });

        Object.values(totals).forEach((total) => {
            total.total_salary =
                total.total_pending +
                total.total_confirmed +
                total.total_paid +
                total.total_attendance_salary;
        });

        const transformedData: Totals[] = Object.values(totals);

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = transformedData.slice(startIndex, endIndex);

        return res.status(200).send({
            status: 200,
            message: 'OK',
            data: paginatedData,
            total_row: transformedData.length,
            current: currentPage,
            page_size: pageSize,
            total_pages: Math.ceil(transformedData.length / pageSize)
        });
    } catch (error: any) {
        return res.status(500).send({
            status: 500,
            message: error.message || "Internal server error"
        });
    }
}


export default { GetDriver, GetDriver2 };
