import styles from "./Hero.module.css"

function Hero({boxData}){
    console.log(boxData)

    const boxes = boxData.map(data => <div className = {styles.box}><h2 className = {styles.boxTitle}>{data["title"]}</h2><img src = {data["image"]}/></div>);
    return <div className = {styles.HeroDiv}>
        <h2 className = {styles.heroSlogan}>Fresh new threads</h2>
        <div className></div>
        {boxes}
    </div>
}

export default Hero
