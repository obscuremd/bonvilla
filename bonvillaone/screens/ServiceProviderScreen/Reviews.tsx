import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, StarHalf } from "lucide-react";

export default function Reviews() {
  return (
    <div>
      <div className="space-y-2">
        <p className="text-4xl font-black text-primary-c">Reviews</p>
        <div className="flex flex-col-reverse md:flex-row justify-between">
          <p className="md:w-[50%]">
            Hairixify guarantees that reviews with the &quot;Verified Hairixify
            user&quot; tag have been added by registered Hairixify users who
            have had an appointment with the provider.
          </p>
          <div className="bg-muted p-3 rounded-3xl">
            <p className="text-2xl font-black">4.95 / 5</p>
            <div className="text-primary-c flex gap-1">
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <StarHalf className="w-4 h-4" />
            </div>
            <p className="text-base">Based on 436 Reviews</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 py-5">
        {ReviewsData.map((item, index) => (
          <div key={index} className="bg-muted p-3 rounded-3xl flex gap-2 ">
            <img
              src={item.profile_picture}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className=" font-semibold">{item.username}</p>

              {/* dynamic star rendering */}
              <div className="text-primary-c text-sm flex gap-1">
                {Array.from({ length: item.stars }).map((_, i) => (
                  <Star key={i} className="w-3 h-3" />
                ))}
                {item.stars < 5 &&
                  Array.from({ length: 5 - item.stars }).map((_, i) => (
                    <Star key={i + "empty"} className="w-3 h-3 opacity-20" />
                  ))}
              </div>

              <p className="">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ReviewsData = [
  {
    profile_picture:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600",
    username: "Sarah O.",
    description:
      "Absolutely loved my bridal makeup! It lasted all day and photographed beautifully. Highly recommended!",
    stars: 5,
  },
  {
    profile_picture:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600",
    username: "David M.",
    description:
      "The stylist was friendly and professional. Good experience overall, but the waiting time was slightly long.",
    stars: 4,
  },
  {
    profile_picture:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600",
    username: "Aisha K.",
    description:
      "Amazing skincare consultation — I finally understand my skin type. Already seeing improvements in just a week!",
    stars: 5,
  },
  {
    profile_picture:
      "https://images.unsplash.com/photo-1466112928291-0903b80a9466?w=600",
    username: "Chinwe U.",
    description:
      "The manicure was nice but didn’t last as long as expected. Might give them another try though.",
    stars: 3,
  },
  {
    profile_picture:
      "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=600",
    username: "Tola B.",
    description:
      "Super friendly service! The hairstylist really listened to what I wanted. I felt pampered the entire time.",
    stars: 5,
  },
  {
    profile_picture:
      "https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?w=600",
    username: "Rita A.",
    description:
      "Great experience overall, but the product they recommended wasn’t available for purchase afterward.",
    stars: 4,
  },
];
