"use client";
import { Calendar, Heart, Tag } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Article() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollStep = () => {
      container.scrollLeft += 1.2; // good sweet spot

      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth
      ) {
        container.scrollLeft = 0;
      }

      animationRef.current = requestAnimationFrame(scrollStep);
    };

    const startScroll = () => {
      stopScroll(); // PROTECT — prevents multiple RAF timers
      animationRef.current = requestAnimationFrame(scrollStep);
    };

    const stopScroll = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    startScroll();

    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);

    return () => {
      stopScroll();
      container.removeEventListener("mouseenter", stopScroll);
      container.removeEventListener("mouseleave", startScroll);
    };
  }, []);

  return (
    <div className="w-full py-14 px-4 mx-auto">
      <h2 className="text-center text-3xl md:text-4xl font-extrabold mb-3">
        Articles & News
      </h2>
      <p className="text-center text-gray-500 md:text-lg mb-8">
        Insights, expert tips, and trends in the beauty & wellness world
      </p>

      <div
        ref={scrollRef}
        className="flex w-full overflow-x-auto gap-6 py-4 scrollbar-hide"
      >
        {articleData.map((item, idx) => (
          <ArticleCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}

function ArticleCard({
  image,
  title,
  description,
  category,
  date,
  likes,
}: {
  image: string;
  title: string;
  description: string;
  category: string;
  date: string;
  likes: number;
}) {
  return (
    <div
      className="
      flex flex-col gap-4 rounded-xl p-3 bg-white border shadow-sm
      hover:shadow-md transition cursor-pointer shrink-0
      w-[250px] md:w-[350px]
    "
    >
      <img
        src={image}
        alt="image"
        className="object-cover h-[160px] md:h-[220px] w-full rounded-lg"
      />

      <div className="flex flex-col gap-1">
        <h3 className="text-base md:text-[1.15rem] font-bold line-clamp-2">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
          {description}
        </p>
      </div>

      <div className="w-full flex justify-between items-center text-[10px] md:text-xs text-gray-500">
        <div className="flex gap-1 items-center">
          <Tag className="w-3 h-3 md:w-4 md:h-4 text-primary-c" />
          <p className="max-w-[6em] truncate text-primary-c">{category}</p>
        </div>
        <div className="flex gap-1 items-center">
          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
          <p>{date}</p>
        </div>
        <div className="flex gap-1 items-center">
          <Heart className="w-3 h-3 md:w-4 md:h-4" />
          <p>{likes}</p>
        </div>
      </div>
    </div>
  );
}

export const articleData = [
  {
    image:
      "https://images.unsplash.com/photo-1629397685944-7073f5589754?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGhhaXIlMjBzYWxvbnxlbnwwfHwwfHx8MA%3D%3D",
    title: "Discover Everything Hairxify Does",
    description:
      "Hairxify is revolutionising the beauty and wellness industry by connecting clients with top professionals...",
    category: "Beauty and style",
    date: "20/11/2024",
    likes: 24,
  },
  {
    image:
      "https://images.unsplash.com/photo-1607008829749-c0f284a49fc4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhhaXIlMjBzYWxvbnxlbnwwfHwwfHx8MA%3D%3D",
    title: "5 Daily Beauty Habits That Transform Your Skin",
    description:
      "A simple guide highlighting everyday routines—hydration, sunscreen, and good nutrition improve skin health...",
    category: "Beauty and style",
    date: "20/11/2024",
    likes: 24,
  },
  {
    image:
      "https://images.unsplash.com/photo-1626379501846-0df4067b8bb9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhhaXIlMjBzYWxvbnxlbnwwfHwwfHx8MA%3D%3D",
    title: "Why Self-Care Is Not a Luxury",
    description:
      "Explore science-backed wellness habits like meditation, massage, aromatherapy and more...",
    category: "Beauty and wellness",
    date: "20/11/2024",
    likes: 24,
  },
  {
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGFpciUyMHNhbG9ufGVufDB8fDB8fHww",
    title: "Why Self-Care Is Not a Luxury",
    description:
      "Explore science-backed wellness habits like meditation, massage, aromatherapy and more...",
    category: "Beauty and wellness",
    date: "20/11/2024",
    likes: 24,
  },
  {
    image:
      "https://images.unsplash.com/photo-1626379501846-0df4067b8bb9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhhaXIlMjBzYWxvbnxlbnwwfHwwfHx8MA%3D%3D",
    title: "Why Self-Care Is Not a Luxury",
    description:
      "Explore science-backed wellness habits like meditation, massage, aromatherapy and more...",
    category: "Beauty and wellness",
    date: "20/11/2024",
    likes: 24,
  },
  {
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGFpciUyMHNhbG9ufGVufDB8fDB8fHww",
    title: "Why Self-Care Is Not a Luxury",
    description:
      "Explore science-backed wellness habits like meditation, massage, aromatherapy and more...",
    category: "Beauty and wellness",
    date: "20/11/2024",
    likes: 24,
  },
];
