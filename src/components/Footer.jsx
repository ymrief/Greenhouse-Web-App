function Footer() {
    return (
        <footer className="px-4 py-6 md:px-10 md:py-8 bg-slate-950/40 border-t border-slate-800 mt-auto text-slate-300 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                <div>
                    <p className="m-0 mb-1 font-semibold text-emerald-400">
                        🌿 Smart Greenhouse
                    </p>
                    <p className="m-0 text-xs text-slate-400">
                        © {new Date().getFullYear()} FIK UPNVJ. All rights reserved.
                    </p>
                </div>
                <div className="text-xs text-slate-400 sm:text-right">
                    <p className="m-0">v1.0.0</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
