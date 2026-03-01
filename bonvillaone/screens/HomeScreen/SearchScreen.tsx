export default function SearchScreen() {
  return (
    <div className="w-full py-14 px-4 max-w-5xl mx-auto">
      <h2 className="text-center text-3xl font-extrabold mb-10">
        Explore Available Stylists & Beauty Services by Location
      </h2>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search City or State…"
          className="w-full max-w-md px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-c"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {locationData.map((section, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-gradient-to-br from-primary-c/10 to-transparent border border-primary-c/30"
          >
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-5">
              <span className="text-primary-c text-3xl">✦</span>
              {section.category}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {section.items.map((loc, i) => (
                <button
                  key={i}
                  className="bg-white border px-3 py-2 rounded-lg hover:border-primary-c hover:text-primary-c text-sm transition"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const locationData = [
  {
    category: "Location by stylist service providers",
    items: [
      "Warri",
      "Yola North",
      "Wuduli",
      "Yola South",
      "Warri North",
      "Warri Central",
      "Umauhmi south",
      "Uruanu",
      "Ukwani",
      "Ukwa West",
      "Umu Nneochi",
      "Egbeda",
      "Sokoto",
      "Ukwu East",
      "Sango Ota",
      "Shomolu",
      "Iyana Ipaja",
    ],
  },
  {
    category: "Location by stylist Marketplace",
    items: [
      "Warri",
      "Yola North",
      "Wuduli",
      "Yola South",
      "Warri North",
      "Warri Central",
      "Umauhmi south",
      "Uruanu",
      "Ukwani",
      "Ukwa West",
      "Umu Nneochi",
      "Egbeda",
      "Sokoto",
      "Ukwu East",
      "Sango Ota",
      "Shomolu",
      "Iyana Ipaja",
    ],
  },
];
