let div = document.querySelector("div");

var text = "";
var secs = 0;

function Update ()
{
    text = `${secs}:${Time.frameCount}<br><br>${Time.deltaTime}`;
    
    if (Time.frameCount % Application.targetFrameRate == 0) secs++;
}

function Render ()
{
    div.innerHTML = text;
}



// ----------



class Application
{
    static targetFrameRate = 60;
}

class Time
{
    static unscaledTime = 0;
    static unscaledDeltaTime = 0;
    static timeScale = 1;
    static frameCount = 0;
    static time = 0;
    static deltaTime = 0;
    static maximumDeltaTime = 0.3333333;
}

class PlayerLoop
{
    static #requestUpdate ()
    {
        requestAnimationFrame(this.#update.bind(this));
    }
    
    static async #update ()
    {
        const slice = (1 / Application.targetFrameRate) - 0.005;
        
        let accumulator = (performance.now() / 1000) - Time.unscaledTime;
        
        while (accumulator >= slice)
        {
            Time.unscaledDeltaTime = (performance.now() / 1000) - Time.unscaledTime;
            Time.unscaledTime += Time.unscaledDeltaTime;
            
            let deltaT = Time.unscaledDeltaTime;
            
            if (deltaT > Time.maximumDeltaTime) deltaT = Time.maximumDeltaTime;
            
            Time.deltaTime = deltaT * Time.timeScale;
            Time.time += Time.deltaTime;
            
            Update();
            
            if (Time.timeScale != 0 && document.hasFocus()) Time.frameCount++;
            
            accumulator -= slice;
        }
        
        Render();
        
        this.#requestUpdate();
    }
    
    static init ()
    {
        this.#requestUpdate();
    }
}



// ----------



window.onload = () => { PlayerLoop.init(); };