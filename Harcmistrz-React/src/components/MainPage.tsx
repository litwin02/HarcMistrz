import Header from "./Partials/Header";

export default function MainPage(){
    return(
    <>
        <Header />
        <main>
            <div className="bg-p_green p-5 lg:px-20 text-white">
                <div className="flex justify-center items-center grid-cols-2">
                    <img src="public/girl-hero-page.png" alt="Harcerka trzymająca bukłak z wodą" className="size-4/12"/>
                    <div className="flex-col">
                        <h1 className="text-left text-5xl mb-10 max-w-2xl">Ciesz się każdym spotkaniem ze swoją grupą.</h1>
                        <h2 className="text-left text-3xl">Resztę obowiązków zostaw nam.</h2>
                    </div>
                </div>
            </div>
        </main>
    </>
    );
}