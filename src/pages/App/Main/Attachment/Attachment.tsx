import * as classes from '@/pages/App/Main/Attachment/Attachment.css.ts';
import { Attachment as AttachmentType } from '@/types/Message.ts';
import { getPDFDocument, marked } from '@/utils/utils.ts';
import { ActionIcon, Box, Center, Image, ScrollArea, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { ReactNode, useEffect, useRef, useState } from 'react';

function AttachmentPreview(props: { attachment: AttachmentType }) {
  const { attachment } = props;
  if (attachment.url.startsWith('data:image')) {
    return <ImageAttachmentPreview attachment={attachment} />;
  } else if (attachment.url.startsWith('data:application/pdf')) {
    return <PDFAttachmentPreview attachment={attachment} />;
  } else {
    return <TextAttachmentPreview attachment={attachment} />;
  }
}

function TextAttachmentPreview(props: { attachment: AttachmentType }) {
  const { attachment } = props;
  const extension = attachment.name.split('.').pop();
  const content = atob(attachment.url.split(',')[1])
    .split('\n')
    .map(line => line.replace(/\r/g, ''))
    .join('\n');

  return (
    <Box
      className="prose prose-invert max-w-none"
      h="100%"
      mt="lg"
      w="100%"
      dangerouslySetInnerHTML={{
        __html: marked.parse(`\`\`\`${extension}\n${content}\n\`\`\``, {
          gfm: true,
          breaks: true,
        }),
      }}
    />
  );
}

function ImageAttachmentPreview(props: { attachment: AttachmentType }) {
  const { attachment } = props;
  return <Image h="100%" mt="lg" radius="md" src={attachment.url} w="100%" />;
}

function PDFAttachmentCanvas(props: { pageNumber: number; pdf: PDFDocumentProxy }) {
  const { pageNumber, pdf } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async function () {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasContext = canvas.getContext('2d');
      if (!canvasContext) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      page.render({ canvasContext, viewport });
    })();
  }, []);

  return <canvas ref={canvasRef} style={{ height: '100%', width: '100%' }} />;
}

function PDFAttachmentPreview(props: { attachment: AttachmentType }) {
  const { attachment } = props;
  const [pdf, setPDF] = useState<PDFDocumentProxy | null>(null);

  useEffect(() => {
    (async function () {
      const pdf = await getPDFDocument(attachment.url);
      setPDF(pdf);
    })();
  }, []);

  return (
    <Box h="100%" mt="lg" w="100%">
      {Array.from({ length: pdf?.numPages ?? 0 }, (_, i) => (
        <PDFAttachmentCanvas key={i} pageNumber={i + 1} pdf={pdf!} />
      ))}
    </Box>
  );
}

function AttachmentThumbnail(props: { attachment: AttachmentType }) {
  const { attachment } = props;
  if (attachment.url.startsWith('data:image')) {
    return <ImageAttachmentThumbnail attachment={attachment} />;
  } else {
    return <FileAttachmentThumbnail attachment={attachment} />;
  }
}

function FileAttachmentThumbnail(props: { attachment: AttachmentType }) {
  const { attachment } = props;
  return (
    <Center h="100%" w="100%">
      <Text c="white" size="xs">
        {attachment.name}
      </Text>
    </Center>
  );
}

function ImageAttachmentThumbnail(props: { attachment: AttachmentType }) {
  const { attachment } = props;
  return <Image h="100%" radius="md" src={attachment.url} w="100%" />;
}

function AttachmentContainer(props: {
  attachment: AttachmentType;
  type: 'message' | 'textarea';
  onDelete?: () => void;
  children: ReactNode;
}) {
  const { attachment, type, onDelete, children } = props;
  const openPreview = () =>
    modals.open({
      children: <AttachmentPreview attachment={attachment} />,
      title: attachment.name,
      centered: true,
      withCloseButton: false,
      size: 'lg',
      scrollAreaComponent: ScrollArea.Autosize,
    });

  if (type === 'message') {
    let clazz: string;

    if (attachment.url.startsWith('data:image')) {
      clazz = classes.messageImageAttachmentContainer;
    } else {
      clazz = classes.messageFileAttachmentContainer;
    }

    return (
      <Box bg="dark.8" className={clazz} onClick={openPreview}>
        {children}
      </Box>
    );
  } else {
    return (
      <Box bg="dark.8" className={classes.textAreaAttachmentContainer} onClick={openPreview} pos="relative">
        {children}
        <ActionIcon
          className={classes.textAreaAttachmentActions}
          radius="sm"
          size={28}
          onClick={e => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          <IconTrash />
        </ActionIcon>
      </Box>
    );
  }
}

export default function Attachment(props: {
  attachment: AttachmentType;
  type: 'message' | 'textarea';
  onDelete?: () => void;
}) {
  const { attachment, type, onDelete } = props;

  return (
    <AttachmentContainer attachment={attachment} onDelete={onDelete} type={type}>
      <AttachmentThumbnail attachment={attachment} />
    </AttachmentContainer>
  );
}
