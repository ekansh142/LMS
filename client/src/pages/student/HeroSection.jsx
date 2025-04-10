import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import HeroImage from '../../images/meeting.jpg';

const stats = [
    { label: 'Years of Learning Experience', value: '25+' },
    { label: 'Students Enrolled', value: '56k' },
    { label: 'Expert Instructors', value: '170+' },
];

const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const searchHandler = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== "") {
            navigate(`/course/search?query=${searchQuery}`);
        }
        setSearchQuery("");
    };

    return (
        <div className="bg-gradient-to-br from-orange-25 to-rose-50 dark:bg-transparent py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white leading-tight mb-6">
                        Smart Learning <br /> Deeper & More{' '}
                        <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                            Amazing
                        </span>
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-300 text-lg mb-8">
                        Empowering learners worldwide with high-quality, accessible, and engaging education.
                    </p>

                    {/* Search Bar */}
                    <form
                        onSubmit={searchHandler}
                        className="flex items-center bg-white dark:bg-zinc-700 rounded-full shadow-lg overflow-hidden max-w-xl mb-6"
                    >
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for courses..."
                            className="flex-grow px-6 py-4 bg-transparent border-none focus-visible:ring-0 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
                        />
                        <Button
                            type="submit"
                            className="rounded-r-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4"
                        >
                            <Search className="mr-2 h-5 w-5" /> Search
                        </Button>
                    </form>

                    {/* Explore Button with hover animation */}
                    <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
                        <Button
                            onClick={() => navigate(`/course/search?query`)}
                            variant="secondary"
                            className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-6 py-3 rounded-full shadow-md"
                        >
                            Explore All Courses
                        </Button>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="text-center"
                            >
                                <p className="text-3xl font-bold text-orange-500">{stat.value}</p>
                                <p className="text-zinc-600 dark:text-zinc-300 text-sm mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Content / Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex justify-center"
                >
                    <div className="w-full max-w-md aspect-square bg-white dark:bg-zinc-700 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
                        <img
                            src={HeroImage}
                            alt="Hero"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default HeroSection;
