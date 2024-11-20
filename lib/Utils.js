import _ from 'lodash';
import moment from 'moment'; 
class Utils {

    static randomString(len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var randomString = '';

        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }

        return randomString;// + Math.floor(Date.now());
    }

    static isEmpty(variable) {

        if (_.isUndefined(variable))
            return true;

        if (_.isNull(variable))
            return true;

        if (_.isString(variable) && _.isEmpty(variable))
            return true;

        return false;

    }
    static now() {
        return Math.floor(Date.now());
    }
    static getTodayDate() {
        let date = moment(Date.now()).format('YYYY-MM-DD');
        return date;
    }
    static getDateTime() {
        var d = new Date() 
        let date = moment(d).format('YYYY-MM-DD HH:mm:ss');
        return date;
    }
    static formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            var i = (parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString());
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            console.log(e)
            return amount
        }
    }
  
}

export default Utils