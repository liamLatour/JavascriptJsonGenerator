
//Traduit les entrées utilisateurs pour la machine
function translateName(name){
    if(name == "Humidité_température"){
        return "SHT35";
    }
    else if(name == "Pression"){
        return "LPS25";
    }
    else if(name == "Luminosité"){
        return "OPT3001";
    }
    else if(name == "Mouvement"){
        return "LIS3DH";
    }
    else if(name == "Pluviomètre"){
        return "RainGaugeContact";
    }
    else if(name == "iHumidité_température"){
        return "SHT35_INT";
    }
    else if(name == "iPression"){
        return "LPS25_INT";
    }
    else if(name == "iLuminosité"){
        return "OPT3001_INT";
    }
    else if(name == "iMouvement"){
        return "LIS3DH_INT";
    }
    else if(name == "SPI"){
        return "SPI_INT";
    }
    else if(name == "I2C"){
        return "I2C_INT";
    }
    else if(name == "UART"){
        return "USART_INT";
    }
    else if(name == "SDI-12"){
        return "SDI12_INT";
    }
    else if(name == "SDI"){
        return "SDI_INT";
    }
    else if(name == "OPTO1"){
        return "OPTO1_INT";
    }
    else if(name == "OPTO2"){
        return "OPTO2_INT";
    }
    else if(name == "INT_1"){
        return "INT1_INT";
    }
    else if(name == "INT_2"){
        return "INT2_INT";
    }
    else{
        return name;
    }
}

//Complementary function
function translateAcr(name){
    if(name == "SHT35"){
        return "Humidité_température";
    }
    else if(name == "LPS25"){
        return "Pression";
    }
    else if(name == "OPT3001"){
        return "Luminosité";
    }
    else if(name == "LIS3DH"){
        return "Mouvement";
    }
    else if(name == "RainGaugeContact"){
        return "Pluviomètre";
    }
    else if(name == "SHT35_INT"){
        return "iHumidité_température";
    }
    else if(name == "LPS25_INT"){
        return "iPression";
    }
    else if(name == "OPT3001_INT"){
        return "iLuminosité";
    }
    else if(name == "LIS3DH_INT"){
        return "iMouvement";
    }
    else if(name == "SPI_INT"){
        return "SPI";
    }
    else if(name == "I2C_INT"){
        return "I2C";
    }
    else if(name == "UART_INT"){
        return "USART";
    }
    else if(name == "SDI12_INT"){
        return "SDI-12";
    }
    else if(name == "SDI_INT"){
        return "SDI";
    }
    else if(name == "OPTO1_INT"){
        return "OPTO1";
    }
    else if(name == "OPTO2_INT"){
        return "OPTO2";
    }
    else if(name == "INT1_INT"){
        return "INT_1";
    }
    else if(name == "INT2_INT"){
        return "INT_2";
    }
    else{
        return name;
    }
}