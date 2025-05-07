export default function LoadingSpinner() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-2xl mb-4">Loading</p>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
      </div>
    );
  }