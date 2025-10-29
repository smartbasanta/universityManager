"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PreviewResearchNews() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get data from URL parameters
  const title = searchParams.get('title') || '';
  const abstract = searchParams.get('abstract') || '';
  const featuredImageUrl = searchParams.get('featuredImageUrl') || '';
  const youtubeLink = searchParams.get('youtubeLink') || '';
  const article = searchParams.get('article') || '';
  const category = searchParams.get('category') || '';
  const tags = searchParams.get('tags') ? JSON.parse(decodeURIComponent(searchParams.get('tags')!)) : [];
  const paperLink = searchParams.get('paperLink') || '';

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push('/dashboard/research-news/new');
  };

  const getCategoryDisplay = (categoryValue: string) => {
    const categoryMapping: { [key: string]: string } = {
      "ai": "Artificial Intelligence",
      "aerospace": "Aerospace Engineering",
      "health": "Health & Medicine",
      "sustainability": "Sustainability",
      "quantum": "Quantum Computing",
      "other": "Other"
    };
    return categoryMapping[categoryValue] || categoryValue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Preview Research News</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <img
                src={featuredImageUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="text-gray-500">Featured Image Preview</div>';
                }}
              />
            </div>
          )}

          <div className="p-8">
            {/* Category Badge */}
            {category && (
              <div className="mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {getCategoryDisplay(category)}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {title || "Research News Title"}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
              <span>Published on {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>Research News</span>
            </div>

            {/* Abstract */}
            {abstract && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Abstract</h2>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700 leading-relaxed">{abstract}</p>
                </div>
              </div>
            )}

            {/* YouTube Video */}
            {youtubeLink && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Narration Video</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-600 mb-2">YouTube Video:</p>
                  <a 
                    href={youtubeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {youtubeLink}
                  </a>
                </div>
              </div>
            )}

            {/* Article Content */}
            {article && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Article</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article }}
                />
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-gray-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Research Paper Link */}
            {paperLink && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Research Paper</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-2">Link to full research paper:</p>
                  <a 
                    href={paperLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {paperLink}
                  </a>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                This is a preview of how your research news will appear when published.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
