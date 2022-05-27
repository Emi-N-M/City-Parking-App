import appSettings from './appSettings.js';

const userBaseUrl =`${appSettings.UserUrl}`
const parkingBaseUrl = `${appSettings.ParkingUrl}`


export const userUrls = {
    addNewUser: `${userBaseUrl}signup/`,
    obtainToken:  `${userBaseUrl}login/`,
    getOneUser: `${userBaseUrl}`,
    getAllUsers: `${userBaseUrl}readAll`,
    hasCar: `${userBaseUrl}`

}


export const parkingUrls = {
    getAllParkings: `${parkingBaseUrl}`,
    addNewParking: `${parkingBaseUrl}`,
    getOneParking:`${parkingBaseUrl}`,
    addCar: `${parkingBaseUrl}`,
    removeCar: `${parkingBaseUrl}`,
    modifyParking: `${parkingBaseUrl}`,
    currentPrice:  `${parkingBaseUrl}`

}