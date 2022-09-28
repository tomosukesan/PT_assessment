//obniz
var obniz = new Obniz("");
//stein
const store = new SteinStore("https://api.steinhq.com/v1/storages/6118698047873c2b733280d8");

obniz.onconnect = async function () {
    //使用パーツ
    var hcsr04 = obniz.wired("HC-SR04", { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
    //初期設定
    let numberOfDecimalPlace = 2;       //小数点以下
    let measuredDistance = 1 * 1000; //測定距離(m):8ftは2.44m
    let count = 0;//失敗回数をカウント
    let id = "";

    //センサー起動
    //挙動確認
    document.getElementById("test-button").onclick = async function () {
        id = document.getElementById("id");
        let distance = await hcsr04.measureWait();
        //距離不足の処理
        if (distance <= measuredDistance) {
            obniz.display.clear();
            count++;
            obniz.display.print(count);
            obniz.display.print("Keep your distance from obniz.");
            console.log("obnizとの距離をとってください。");
            document.getElementById("test-text").innerHTML = (distance * 0.001).toFixed(numberOfDecimalPlace) + "m";
        }
        else{
            console.log((distance * 0.001).toFixed(numberOfDecimalPlace) + "m")
            document.getElementById("test-text").innerHTML = "測定可能です。";
        }
    }
    //測定開始
    document.getElementById("start").onclick = async function () {
        //obniz画面
        obniz.display.clear();

        //開始位置
        let startDistance = await hcsr04.measureWait();

        //時間開始
        const startTime = Date.now();
        //計測時間
        let temporary = 0;
        while (1) {
            temporary = await hcsr04.measureWait();
            if ((startDistance - temporary) >= measuredDistance) {
                console.log("finish!");
                break;
            }
            console.log(".");
        }
        //時間終了
        const endTime = Date.now();
        console.log("distance: " + ((startDistance - temporary) * 0.001).toFixed(numberOfDecimalPlace) + "m");
        let result = ((endTime - startTime) * 0.001).toFixed(numberOfDecimalPlace);//秒で表示
        console.log("time    : " + result + "秒");
        obniz.display.clear();
        obniz.display.print("distance: " + ((startDistance - temporary) * 0.001).toFixed(numberOfDecimalPlace) + "m");
        obniz.display.print("\ntime    : " + result + "sec");
        /*
        なぜあるのかわからん
        obniz.display.print((startDistance*0.001).toFixed(numberOfDecimalPlace) + "m");
        console.log((startDistance*0.001).toFixed(numberOfDecimalPlace) + "m");
        */
        //steinへ
        store.edit("sheet1", {
            search: {id: id.value},
            set: {feet_sec: result},
            limit: 1
            }
        ).then(res => {
            console.log(res);
        });
    }
}