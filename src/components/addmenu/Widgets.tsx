const widgetOptions = [
    { name: "Search", imgSrc: "/icons/search.png" },
    { name: "Notes", imgSrc: "/icons/notes.png" },
    { name: "Clock", imgSrc: "/icons/clock.png" },
    { name: "Image", imgSrc: "/icons/image.png" },
    { name: "ChatAI", imgSrc: "/icons/chatai.png" },
    { name: "To Do", imgSrc: "/icons/todo.png" },
  ];
  
  
  const Widgets = () => {
  
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Available Widgets</h3>
        <div className="grid grid-cols-4 gap-6">
          {widgetOptions.map((widget, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              {/* No extra div, just the image */}
              <img src={widget.imgSrc} alt={widget.name} className="w-16 h-16 object-contain" />
  
              {/* Widget Name */}
              <span className="text-sm mt-2 font-medium text-gray-900">{widget.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Widgets;