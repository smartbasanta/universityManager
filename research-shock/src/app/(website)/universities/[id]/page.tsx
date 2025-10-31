
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UniversityHeader } from '@/components/universities/UniversityHeader';
import { University } from '@/types/university';
import { SchoolTabs } from '@/components/universities/SchoolTabs';

interface PageProps {
  params: {
    id: string;
  };
}

async function getUniversityData(id: string): Promise<University> {
  const [
    basicInfoRes,
    generalSectionsRes,
    undergraduateSectionRes,
    graduateSectionRes,
    careerOutcomesRes,
  ] = await Promise.all([
    fetch(`http://localhost:4000/api/v1/website/universities/${id}/basic-info`),
    fetch(`http://localhost:4000/api/v1/website/universities/${id}/general-sections`),
    fetch(`http://localhost:4000/api/v1/website/universities/${id}/undergraduate-section`),
    fetch(`http://localhost:4000/api/v1/website/universities/${id}/graduate-section`),
    fetch(`http://localhost:4000/api/v1/website/universities/${id}/career-outcomes`),
  ]);

  if (
    !basicInfoRes.ok ||
    !generalSectionsRes.ok ||
    !undergraduateSectionRes.ok ||
    !graduateSectionRes.ok ||
    !careerOutcomesRes.ok
  ) {
    throw new Error('Failed to fetch university data');
  }

  const basicInfo = await basicInfoRes.json();
  const generalSections = await generalSectionsRes.json();
  const undergraduateSection = await undergraduateSectionRes.json();
  const graduateSection = await graduateSectionRes.json();
  const careerOutcomes = await careerOutcomesRes.json();

  return {
    ...basicInfo,
    ...generalSections,
    undergraduate_admissions: undergraduateSection.admissions,
    undergraduate_tuition_fees: undergraduateSection.tuition_fees,
    undergraduate_departments: undergraduateSection.departments,
    graduate_admissions: graduateSection.admissions,
    graduate_tuition_fees: graduateSection.tuition_fees,
    graduate_departments: graduateSection.departments,
    career_outcomes: careerOutcomes,
  };
}

export default async function UniversityPage({ params: { id } }: PageProps) {
  try {
    const university = await getUniversityData(id);

    return (
      <div className="relative flex flex-col bg-gray-50 min-h-screen">
        <Header />
        <main className="flex-grow">
          <UniversityHeader basicInfo={university} />
          <div className="container mx-auto px-4 py-12">
            <SchoolTabs university={university} />
          </div>
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error(`Failed to load university ${id}:`, error);
    notFound();
  }
}

export async function generateMetadata({ params: { id } }: PageProps) {
  try {
    const university = await getUniversityData(id);

    return {
      title: `${university.university_name} - ResearchShock`,
      description: university.about || `Learn more about ${university.university_name}`,
    };
  } catch (error) {
    return {
      title: 'University Not Found - ResearchShock',
      description: 'The requested university could not be found.',
    };
  }
}
