const EmergencyServices = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Emergency Services</h1>
      <div className="space-y-6">
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">Emergency Numbers</h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <span className="font-bold mr-2">Police:</span> 911
            </li>
            <li className="flex items-center">
              <span className="font-bold mr-2">Fire:</span> 911
            </li>
            <li className="flex items-center">
              <span className="font-bold mr-2">Ambulance:</span> 911
            </li>
          </ul>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Non-Emergency Services</h2>
          <ul className="space-y-3">
            <li>Local Police Department</li>
            <li>Fire Department</li>
            <li>Medical Services</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmergencyServices;
