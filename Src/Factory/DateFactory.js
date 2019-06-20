import React, {Component} from 'react'

export function GetDateToday(){

    var today = new Date();


    var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
    var mon = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
    var todaysDate = today.getFullYear() + "-" + mon + "-" + day;

    return todaysDate;
}

export function GetThisMonth(){
    
    var today = new Date();

    var mon = today.getMonth() + 1;

    return mon;
}

export function GetThisYear(){
    
    var today = new Date();

    var mon = today.getFullYear();

    return mon;
}

export function GetDaysInMonth (month, year) { // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
}

export function FormatDate(date){


    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var mon = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var formattedDate = date.getFullYear() + "-" + mon + "-" + day;

    return formattedDate;
}