"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import RichTextEditor from "@/components/text-editor";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  useGetResearchNewsById,
  useUpdateResearchNews,
} from "@/hooks/api/research/research.query";
import { toast } from "react-toastify";

// Function to get filename from URL
const getFilenameFromUrl = (url: string) => {
  if (!url) return "";
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.split('/').pop() || "uploaded-file";
  } catch {
    return url.split('/').pop() || "uploaded-file";
  }
};

export default function EditResearchNews() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newsId = params.id as string;
  const statusParam = searchParams.get('status') || 'draft';

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [featuredImage, setFeaturedImageUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [article, setArticle] = useState("");
  const [originalArticleHtml, setOriginalArticleHtml] = useState(""); // Store original HTML
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [paperLink, setPaperLink] = useState("");
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageName, setOriginalImageName] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const { data: newsData, isLoading, error } = useGetResearchNewsById(newsId);
  const { mutate: updateResearchNews, isPending: isUpdating } = useUpdateResearchNews();

  // Populate form fields when data is loaded
  useEffect(() => {
    if (newsData && !isDataLoaded) {
      console.log("Loading data from API:", newsData);
      
      setTitle(newsData.title || "");
      setAbstract(newsData.abstract || "");
      setFeaturedImageUrl(newsData.featuredImage || "");
      setOriginalImageName(getFilenameFromUrl(newsData.featuredImage || ""));
      setYoutubeUrl(newsData.youtubeUrl || "");
      
      // Store original HTML and set it for the editor
      const htmlContent = newsData.article || "";
      setOriginalArticleHtml(htmlContent);
      setArticle(htmlContent);
      
      setCategory(newsData.category || "");
      setTags(newsData.tags || []);
      setPaperLink(newsData.paperLink || "");
      setStatus(newsData.status || "");
      setIsDataLoaded(true);
      
      console.log("Article HTML loaded:", htmlContent);
    }
  }, [newsData, isDataLoaded]);


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    setIsUploading(true);
    setUploadError("");
    
    try {
      // Create preview URL for immediate display
      const fileUrl = URL.createObjectURL(file);
      setFeaturedImageUrl(fileUrl);
      
      // Store the actual file object for form submission
      setSelectedFile(file);
      
      console.log("File selected:", file.name);
      toast.success("Image selected successfully!");
      
    } catch (error) {
      console.error('File selection failed:', error);
      setUploadError('Failed to select image. Please try again.');
      toast.error('Failed to select image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleArticleChange = (content: string) => {
    console.log("Article content changed:", content);
    setArticle(content);
  };

  const handleSave = () => {
    console.log("Saving with article content:", article);
    console.log("Original article HTML:", originalArticleHtml);
    
    // Always send HTML content - either the updated content from editor or original HTML
    const articleToSend = article || originalArticleHtml;
    
    const payload = {
      id: newsId,
      title,
      abstract,
      featuredImage: selectedFile ? featuredImage : newsData?.featuredImage || featuredImage,
      youtubeUrl,
      article: articleToSend, // Always HTML content
      category,
      tags,
      paperLink,
      status,
    };

    console.log("Final payload:", payload);

    updateResearchNews(payload, {
      onSuccess: () => {
        toast.success("Research news updated successfully!");
        // Redirect to the correct tab based on status
        const tabMap: { [key: string]: string } = {
          'draft': 'draft',
          'published': 'live',
          'archived': 'archive'
        };
        
        const targetTab = tabMap[statusParam] || 'draft';
        router.push(`/dashboard/research-news?tab=${targetTab}`);
      },
      onError: (error) => {
        console.error("Failed to update research news:", error);
        toast.error("Failed to update research news. Please try again.");
      }
    });
  };

  const handleBack = () => {
    // Redirect to the correct tab based on status
    const tabMap: { [key: string]: string } = {
      'draft': 'draft',
      'published': 'live', 
      'archived': 'archive'
    };
    
    const targetTab = tabMap[statusParam] || 'draft';
    router.push(`/dashboard/research-news?tab=${targetTab}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading research news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading research news: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-[#111418] text-3xl font-bold leading-tight">
          Edit Research News
        </h1>
      </div>

      <form className="space-y-6 max-w-3xl">
        {/* News Title */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            News Title *
          </label>
          <Input
            placeholder="Enter research news title"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Research Abstract */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Research Abstract *
          </label>
          <Textarea
            placeholder="Enter the research abstract"
            className="bg-[#f0f2f5] border-none min-h-36 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          />
        </div>

        {/* Featured Image Upload */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Featured Image *
          </label>
          <Input
            type="file"
            accept="image/*"
            className="bg-[#f0f2f5] border-none p-3"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          
          {/* Upload Status */}
          {isUploading && (
            <p className="text-sm text-blue-500 mt-2">
              Processing image...
            </p>
          )}
          
          {/* Upload Error */}
          {uploadError && (
            <p className="text-sm text-red-500 mt-2">
              {uploadError}
            </p>
          )}
          
          {/* Enhanced Image Preview and Info */}
          {(originalImageName || selectedFile) && !uploadError && (
            <div className="mt-2">
              {selectedFile ? (
                <div>
                  <p className="text-sm text-green-600 mb-2">
                    ✅ New image selected: {selectedFile.name}
                  </p>
                  <p className="text-xs text-blue-600 mb-2">
                    This will replace the current image when you save.
                  </p>
                  {/* New Image Preview */}
                  <img 
                    src={featuredImage} 
                    alt="New image preview" 
                    className="max-w-xs max-h-32 object-cover rounded border"
                  />
                </div>
              ) : (
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Current file:</span> {originalImageName}
                  </p>
                  {/* Current Image Preview if available */}
                  {newsData?.featuredImage && (
                    <img 
                      src={newsData.featuredImage} 
                      alt="Current image" 
                      className="max-w-xs max-h-32 object-cover rounded border mt-2"
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* YouTube Link */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Narration Video (YouTube Link)
          </label>
          <Input
            placeholder="Paste YouTube URL"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        </div>

        {/* News Article Editor */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            News Article *
          </label>
          {isDataLoaded && (
            <RichTextEditor
              value={article}
              onChange={handleArticleChange}
            />
          )}
          <p className="text-gray-500 text-sm mt-2">
            Write or paste the full article here. Use the toolbar to format your content.
          </p>
        </div>

        {/* Research Category */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Research Category *
          </label>
          <Select 
            onValueChange={setCategory} 
            value={(() => {
              const categoryMapping: { [key: string]: string } = {
                "Artificial Intelligence": "ai",
                "Aerospace Engineering": "aerospace", 
                "Health & Medicine": "health",
                "Sustainability": "sustainability",
                "Quantum Computing": "quantum",
                "Other": "other"
              };
              return categoryMapping[category] || category;
            })()}
          >
            <SelectTrigger className="bg-[#f0f2f5] border-none h-14">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai">Artificial Intelligence</SelectItem>
              <SelectItem value="aerospace">Aerospace Engineering</SelectItem>
              <SelectItem value="health">Health & Medicine</SelectItem>
              <SelectItem value="sustainability">Sustainability</SelectItem>
              <SelectItem value="quantum">Quantum Computing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tags / Keywords using TagInput */}
        <div className="px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Tags / Keywords
          </label>
          <TagInput
            value={tags}
            onChange={setTags}
            placeholder="Add tags (e.g., space, propulsion, AI ethics)"
          />
          <p className="text-gray-500 text-sm mt-2">
            Enter keywords related to your research. Press Enter or comma to add each tag.
          </p>
        </div>

        {/* Paper Link */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Link to Research Paper
          </label>
          <Input
            placeholder="Link to the full research paper"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={paperLink}
            onChange={(e) => setPaperLink(e.target.value)}
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Status
          </label>
          <Select onValueChange={setStatus} value={status}>
            <SelectTrigger className="bg-[#f0f2f5] border-none h-14">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isUpdating || !title.trim() || !abstract.trim() || !category || isUploading}
            className="bg-[#198754] text-white hover:bg-[#198754]/90 h-10"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
