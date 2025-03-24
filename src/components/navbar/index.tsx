

const Navbar = () => {

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a className="flex-shrink-0">
                            <span className="text-white text-xl font-bold tracking-tight">
                                NeuroPixel
                            </span>
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a
                                className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                Generate
                            </a>
                            <a
                                className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                Gallery
                            </a>
                            <a
                                className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                Pricing
                            </a>
                            <a
                                className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                About
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </nav>
    )
};

export default Navbar;