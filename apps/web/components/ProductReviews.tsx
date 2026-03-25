"use client";

import { useState } from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
}

const sampleReviews: Review[] = [
  {
    id: "1",
    author: "Sarah M.",
    rating: 5,
    title: "Absolutely love it!",
    content:
      "This bag exceeded my expectations. The leather quality is amazing and it fits everything I need. Perfect for everyday use.",
    date: "2025-01-10",
    verified: true,
  },
  {
    id: "2",
    author: "Jennifer L.",
    rating: 4,
    title: "Great quality, minor issue",
    content:
      "The bag is beautiful and well-made. Only giving 4 stars because the zipper was a bit stiff at first, but it loosened up after a few days of use.",
    date: "2025-01-08",
    verified: true,
  },
  {
    id: "3",
    author: "Michael R.",
    rating: 5,
    title: "Perfect gift",
    content:
      "Bought this as a gift for my wife and she loves it. The packaging was beautiful and the bag looks even better in person.",
    date: "2025-01-05",
    verified: true,
  },
  {
    id: "4",
    author: "Emma W.",
    rating: 5,
    title: "Worth every penny",
    content:
      "I've been eyeing this bag for months and finally pulled the trigger. So glad I did! The quality is outstanding.",
    date: "2025-01-02",
    verified: false,
  },
];

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export default function ProductReviews({
  productId,
  averageRating,
  totalReviews,
}: ProductReviewsProps) {
  const [reviews] = useState<Review[]>(sampleReviews);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit to API
    alert("Review submitted! (Demo mode)");
    setShowForm(false);
    setNewReview({ rating: 5, title: "", content: "" });
  };

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= averageRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600">
              {averageRating} out of 5 ({totalReviews} reviews)
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-gray-50 rounded-lg p-6 mb-8"
        >
          <h3 className="font-semibold mb-4">Write Your Review</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="p-1"
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= newReview.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) =>
                setNewReview({ ...newReview, title: e.target.value })
              }
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Summarize your review"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Review</label>
            <textarea
              value={newReview.content}
              onChange={(e) =>
                setNewReview({ ...newReview, content: e.target.value })
              }
              required
              rows={4}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="What did you like or dislike?"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {review.verified && (
                  <span className="text-green-600 text-sm flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Verified Purchase
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <h4 className="font-semibold mb-1">{review.title}</h4>
            <p className="text-gray-600 mb-2">{review.content}</p>
            <p className="text-sm text-gray-500">By {review.author}</p>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="border border-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition">
          Load More Reviews
        </button>
      </div>
    </section>
  );
}