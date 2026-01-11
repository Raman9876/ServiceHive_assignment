const BidCardSkeleton = () => {
  return (
    <div className="p-5 bg-nexus-black border border-white/10 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10" />
          <div>
            <div className="h-5 w-32 bg-white/10 mb-2" />
            <div className="h-3 w-24 bg-white/10" />
          </div>
        </div>
        <div className="h-6 w-20 bg-white/10" />
      </div>

      {/* Bid Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-white/5 border border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/10" />
          <div>
            <div className="h-3 w-16 bg-white/10 mb-1" />
            <div className="h-5 w-12 bg-white/10" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/10" />
          <div>
            <div className="h-3 w-16 bg-white/10 mb-1" />
            <div className="h-5 w-16 bg-white/10" />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="mb-4">
        <div className="h-4 w-20 bg-white/10 mb-2" />
        <div className="h-4 w-full bg-white/10 mb-1" />
        <div className="h-4 w-full bg-white/10 mb-1" />
        <div className="h-4 w-2/3 bg-white/10" />
      </div>

      {/* Skills */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-white/10" />
        <div className="h-6 w-20 bg-white/10" />
        <div className="h-6 w-14 bg-white/10" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="h-4 w-32 bg-white/10" />
        <div className="h-9 w-24 bg-white/10" />
      </div>
    </div>
  );
};

export default BidCardSkeleton;
