import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGigs } from "../../store/slices/gigSlice";
import GigCard from "../../components/gigs/GigCard";
import GigCardSkeleton from "../../components/gigs/GigCardSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import {
  Search,
  X,
  ChevronDown,
  Briefcase,
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  Terminal,
} from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "Video Editing",
  "Data Entry",
  "Virtual Assistant",
  "Other",
];

const SORT_OPTIONS = [
  { value: "newest", label: "NEWEST" },
  { value: "budget-high", label: "BUDGET ↑" },
  { value: "budget-low", label: "BUDGET ↓" },
  { value: "deadline", label: "DEADLINE" },
  { value: "bids", label: "BIDS" },
];

const GigFeed = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { gigs, isLoading, pagination } = useSelector((state) => state.gigs);

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All Categories"
  );
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get("sort") || "newest"
  );
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const params = {
      search: searchParams.get("search") || "",
      category:
        selectedCategory !== "All Categories" ? selectedCategory : undefined,
      sort: selectedSort,
      page: 1,
    };

    dispatch(fetchGigs(params));
  }, [dispatch, searchParams, selectedCategory, selectedSort]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput) {
      newParams.set("search", searchInput);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category !== "All Categories") {
      newParams.set("category", category);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", sort);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSelectedCategory("All Categories");
    setSelectedSort("newest");
    setSearchParams({});
  };

  const hasActiveFilters =
    searchInput ||
    selectedCategory !== "All Categories" ||
    selectedSort !== "newest";

  const loadMore = () => {
    if (pagination?.hasMore) {
      dispatch(
        fetchGigs({
          search: searchParams.get("search") || "",
          category:
            selectedCategory !== "All Categories"
              ? selectedCategory
              : undefined,
          sort: selectedSort,
          page: pagination.currentPage + 1,
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-nexus-black py-8 relative overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 77, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 77, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-glow-cyan/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="w-6 h-6 text-accent-orange" />
            <span className="text-xs font-mono text-glow-cyan tracking-wider">
              GIG_MARKETPLACE
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
            FIND WORK
          </h1>
          <p className="text-text-secondary font-mono text-sm">
            Discover opportunities that match your skills
          </p>
        </motion.div>

        {/* Search & Filters Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="nexus-card mb-8"
        >
          <div className="p-5">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search gigs by title or description..."
                    className="input pl-12 pr-28 w-full"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-accent-orange hover:bg-accent-orange-hover text-white font-mono text-sm transition-colors"
                  >
                    SEARCH
                  </button>
                </div>
              </form>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden py-3 px-5 bg-white/5 border border-white/10 text-text-secondary flex items-center justify-center gap-2 font-mono text-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                FILTERS
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-accent-orange rounded-full" />
                )}
              </button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Category Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 bg-white/5 border border-white/10 text-text-secondary text-sm font-mono min-w-[180px] focus:outline-none focus:border-accent-orange/50 cursor-pointer"
                  >
                    {CATEGORIES.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-nexus-black text-text-secondary"
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={selectedSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 bg-white/5 border border-white/10 text-text-secondary text-sm font-mono min-w-[140px] focus:outline-none focus:border-accent-orange/50 cursor-pointer"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-nexus-black text-text-secondary"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="flex border border-white/10">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 transition-colors ${
                      viewMode === "grid"
                        ? "bg-accent-orange text-white"
                        : "bg-white/5 text-text-muted hover:text-white"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 transition-colors ${
                      viewMode === "list"
                        ? "bg-accent-orange text-white"
                        : "bg-white/5 text-text-muted hover:text-white"
                    }`}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mt-4 pt-4 border-t border-white/10 space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="section-label mb-2">CATEGORY</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="input w-full"
                    >
                      {CATEGORIES.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-nexus-black"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="section-label mb-2">SORT BY</label>
                    <select
                      value={selectedSort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="input w-full"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-nexus-black"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center gap-2 font-mono text-sm"
                    >
                      <X className="w-4 h-4" />
                      CLEAR ALL FILTERS
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results Count */}
        {!isLoading && pagination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-6"
          >
            <p className="text-sm font-mono text-text-muted">
              SHOWING{" "}
              <span className="text-accent-orange font-bold">
                {gigs.length}
              </span>{" "}
              OF{" "}
              <span className="text-white font-bold">
                {pagination.totalGigs}
              </span>{" "}
              GIGS
            </p>
          </motion.div>
        )}

        {/* Gigs Grid */}
        {isLoading ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {[...Array(6)].map((_, i) => (
              <GigCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : gigs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="NO GIGS FOUND"
            description={
              hasActiveFilters
                ? "Try adjusting your search or filters to find what you're looking for."
                : "There are no open gigs at the moment. Check back later!"
            }
            action={
              hasActiveFilters && (
                <button onClick={clearFilters} className="btn-primary">
                  CLEAR FILTERS
                </button>
              )
            }
          />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              <AnimatePresence>
                {gigs.map((gig, index) => (
                  <GigCard key={gig._id} gig={gig} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load More */}
            {pagination?.hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-12"
              >
                <button
                  onClick={loadMore}
                  className="px-8 py-3.5 font-mono font-medium text-accent-orange border-2 border-accent-orange/50 bg-accent-orange/10 hover:bg-accent-orange/20 transition-colors"
                >
                  LOAD MORE GIGS
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GigFeed;
