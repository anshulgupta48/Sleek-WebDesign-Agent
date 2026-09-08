import ChatInterface from '@/components/chat';

const ProjectDetails = async ({
  params,
}: {
  params: Promise<{ slugId: string }>;
}) => {
  const { slugId } = await params;

  return (
    <div>
      <ChatInterface key={slugId} isProjectPage={true} slugId={slugId} />
    </div>
  );
};

export default ProjectDetails;
