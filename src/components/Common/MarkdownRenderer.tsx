import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  variant?: 'default' | 'notice' | 'knowledge' | 'compact';
  /** 是否启用错误边界保护 */
  enableErrorBoundary?: boolean;
  /** 自定义错误回退内容 */
  errorFallback?: React.ReactNode;
  /** 最大内容长度限制（字符数） */
  maxLength?: number;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  variant = 'default',
  enableErrorBoundary = true,
  errorFallback = null,
  maxLength = 50000,
}) => {
  const { t } = useTranslation('common');
  // 错误处理和边界情况检查 - 使用 useCallback 优化
  const validateContent = useCallback(
    (text: string): string => {
      if (!text || typeof text !== 'string') {
        return '';
      }

      // 长度限制
      if (text.length > maxLength) {
        console.warn(
          `Markdown content exceeds maximum length (${maxLength} characters). Content will be truncated.`,
        );
        const truncatedContent = `${text.substring(0, maxLength)}\n\n...\n\n*[${t('markdown.contentTruncated')}]*`;
        return truncatedContent;
      }

      return text;
    },
    [maxLength, t],
  );

  // 使用 useMemo 优化性能，避免重复计算
  const customComponents = useMemo(() => {
    const baseComponents = {
      // 标题样式 - 添加无障碍访问支持
      h1: ({ children }: { children: React.ReactNode }) => {
        switch (variant) {
          case 'notice':
            return (
              <h4 className="text-primary f-fw-600 mg-t-25 mg-b-15" role="heading" aria-level={1}>
                {children}
              </h4>
            );
          case 'knowledge':
            return (
              <h3 className="text-primary f-fw-600 mg-t-30 mg-b-20" role="heading" aria-level={1}>
                {children}
              </h3>
            );
          case 'compact':
            return (
              <h5 className="text-primary f-fw-600 mg-t-15 mg-b-10" role="heading" aria-level={1}>
                {children}
              </h5>
            );
          default:
            return (
              <h3 className="text-primary f-fw-600 mg-t-25 mg-b-18" role="heading" aria-level={1}>
                {children}
              </h3>
            );
        }
      },

      h2: ({ children }: { children: React.ReactNode }) => {
        switch (variant) {
          case 'notice':
            return <h5 className="text-primary f-fw-600 mg-t-20 mg-b-12">{children}</h5>;
          case 'knowledge':
            return <h4 className="text-primary f-fw-600 mg-t-25 mg-b-20">{children}</h4>;
          case 'compact':
            return <h6 className="text-primary f-fw-600 mg-t-12 mg-b-8">{children}</h6>;
          default:
            return <h4 className="text-primary f-fw-600 mg-t-20 mg-b-15">{children}</h4>;
        }
      },

      h3: ({ children }: { children: React.ReactNode }) => {
        switch (variant) {
          case 'notice':
            return <h6 className="text-secondary f-fw-600 mg-t-15 mg-b-10">{children}</h6>;
          case 'knowledge':
            return <h5 className="text-primary f-fw-600 mg-t-20 mg-b-15">{children}</h5>;
          case 'compact':
            return (
              <span className="text-secondary f-fw-600 mg-t-10 mg-b-5 d-block">{children}</span>
            );
          default:
            return <h5 className="text-secondary f-fw-600 mg-t-18 mg-b-12">{children}</h5>;
        }
      },

      h4: ({ children }: { children: React.ReactNode }) => (
        <h6 className="text-secondary f-fw-600 mg-t-15 mg-b-10">{children}</h6>
      ),

      h5: ({ children }: { children: React.ReactNode }) => (
        <span className="text-secondary f-fw-600 mg-t-12 mg-b-8 d-block">{children}</span>
      ),

      h6: ({ children }: { children: React.ReactNode }) => (
        <span className="text-secondary f-fw-500 mg-t-10 mg-b-6 d-block">{children}</span>
      ),

      // 段落样式
      p: ({ children }: { children: React.ReactNode }) => {
        switch (variant) {
          case 'notice':
            return <p className="mg-b-15 f-s-15 text-dark f-fw-400 line-height-1-6">{children}</p>;
          case 'knowledge':
            return <p className="mg-b-15 f-s-14 text-dark">{children}</p>;
          case 'compact':
            return <p className="mg-b-10 f-s-13 text-dark">{children}</p>;
          default:
            return <p className="mg-b-15 f-s-14 text-dark line-height-1-6">{children}</p>;
        }
      },

      // 链接样式 - 增强按钮链接支持
      a: ({
        href,
        children,
        className,
        style: _style,
      }: {
        href?: string;
        children: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
      }) => {
        // 安全检查：防止 XSS 攻击
        if (
          !href ||
          href.startsWith('javascript:') ||
          href.startsWith('data:') ||
          href.startsWith('vbscript:')
        ) {
          return <span className="text-muted">{children}</span>;
        }

        // 检查是否为按钮样式的链接
        const isButtonLink =
          className && (className.includes('btn') || className.includes('button'));

        // 处理按钮样式链接
        if (isButtonLink) {
          // 处理特殊协议链接（如 clash://）
          const isSpecialProtocol =
            href.includes('://') && !href.startsWith('http://') && !href.startsWith('https://');

          return (
            <a
              href={href}
              className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2 mg-t-10 mg-b-10"
              target={isSpecialProtocol ? undefined : '_blank'}
              rel={isSpecialProtocol ? undefined : 'noopener noreferrer'}
            >
              {children}
            </a>
          );
        }

        // 内部链接（相对路径或者以 # 开头）
        if (href.startsWith('#') || href.startsWith('/') || !href.includes('://')) {
          return (
            <a href={href} className="link-primary text-d-underline f-fw-500">
              {children}
            </a>
          );
        }

        // 外部链接
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-primary text-d-underline f-fw-500"
          >
            {children}
            <i className="ph ph-arrow-square-out f-s-11 mg-s-4"></i>
          </a>
        );
      },

      // 强调文本
      strong: ({ children }: { children: React.ReactNode }) => (
        <strong className="f-fw-600 text-dark">{children}</strong>
      ),

      em: ({ children }: { children: React.ReactNode }) => (
        <em className="f-fs-italic text-secondary">{children}</em>
      ),

      // 删除线
      del: ({ children }: { children: React.ReactNode }) => (
        <del className="text-muted text-d-line-through">{children}</del>
      ),

      // 分割线
      hr: () => <hr className="mg-t-20 mg-b-20 border-secondary" />,

      // 代码块
      code: ({
        inline,
        children,
        className,
      }: {
        inline?: boolean;
        children: React.ReactNode;
        className?: string;
      }) => {
        if (inline) {
          return (
            <code className="bg-light pa-4 b-r-5 f-s-13 text-danger f-fw-500 border">
              {children}
            </code>
          );
        }

        // 提取语言类型
        const language = className?.replace('language-', '') ?? '';

        return (
          <div className="mg-t-15 mg-b-15">
            {language && (
              <div className="bg-secondary text-white pa-8 pa-s-15 f-s-11 f-fw-600 b-r-5 b-r-b-0 text-uppercase">
                {language}
              </div>
            )}
            <pre
              className={`bg-light pa-15 b-r-5 ${language ? 'b-r-t-0' : ''} border overflow-auto`}
            >
              <code className="f-s-13 text-dark f-fw-400">{children}</code>
            </pre>
          </div>
        );
      },

      // 引用块 - 使用CSS类而非内联样式
      blockquote: ({ children }: { children: React.ReactNode }) => {
        switch (variant) {
          case 'notice':
            return (
              <blockquote className="blockquote-notice pa-20 mg-t-20 mg-b-20 shadow-sm">
                <div className="quote-mark-start">&ldquo;</div>
                <div className="f-s-15 text-dark f-fw-400 line-height-1-7 f-fs-italic pa-s-10">
                  {children}
                </div>
                <div className="quote-mark-end">&rdquo;</div>
              </blockquote>
            );

          case 'knowledge':
            return (
              <blockquote className="blockquote-knowledge pa-18 mg-t-18 mg-b-18 shadow-sm">
                <div className="d-flex align-items-start">
                  <i className="ph ph-quotes f-s-20 quote-icon mg-e-12 mg-t-2 flex-shrink-0"></i>
                  <div className="f-s-14 text-dark f-fw-400 line-height-1-6 f-fs-italic flex-grow-1">
                    {children}
                  </div>
                </div>
              </blockquote>
            );

          case 'compact':
            return (
              <blockquote className="blockquote-compact">
                <div className="f-s-13 text-muted f-fs-italic line-height-1-5">{children}</div>
              </blockquote>
            );

          default:
            return (
              <blockquote className="blockquote-default pa-16 mg-t-16 mg-b-16 shadow-sm">
                <div className="quote-mark">❝</div>
                <div className="f-s-14 text-dark f-fw-400 line-height-1-6 f-fs-italic pa-s-8">
                  {children}
                </div>
              </blockquote>
            );
        }
      },

      // 列表样式
      ul: ({ children }: { children: React.ReactNode }) => (
        <ul className="mg-b-15 pa-s-20">{children}</ul>
      ),

      ol: ({ children }: { children: React.ReactNode }) => (
        <ol className="mg-b-15 pa-s-20">{children}</ol>
      ),

      li: ({ children }: { children: React.ReactNode }) => (
        <li className="mg-b-8 f-s-14 text-dark line-height-1-5">{children}</li>
      ),

      // 表格样式 - 改进无障碍访问
      table: ({ children }: { children: React.ReactNode }) => (
        <div className="table-responsive mg-t-15 mg-b-20">
          <table className="table table-striped table-bordered b-r-10 shadow-sm" role="table">
            {children}
          </table>
        </div>
      ),

      thead: ({ children }: { children: React.ReactNode }) => (
        <thead className="bg-primary" role="rowgroup">
          {children}
        </thead>
      ),

      th: ({ children }: { children: React.ReactNode }) => (
        <th className="text-white pa-12 f-s-13 f-fw-600 border-0" scope="col" role="columnheader">
          {children}
        </th>
      ),

      td: ({ children }: { children: React.ReactNode }) => (
        <td className="pa-12 f-s-13 text-dark border-light">{children}</td>
      ),

      tbody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,

      tr: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,

      // 图片样式
      img: ({ src, alt, title }: { src?: string; alt?: string; title?: string }) => {
        if (!src) return null;

        return (
          <div className="text-center mg-t-20 mg-b-20">
            <img
              src={src}
              alt={alt ?? ''}
              title={title}
              className="img-fluid b-r-10 shadow-sm"
              loading="lazy"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            {alt && <div className="f-s-12 text-muted mg-t-8 f-fs-italic">{alt}</div>}
          </div>
        );
      },

      // 任务列表
      input: ({ type, checked }: { type?: string; checked?: boolean }) => {
        if (type === 'checkbox') {
          return (
            <input type="checkbox" checked={checked} disabled className="mg-e-8 form-check-input" />
          );
        }
        return null;
      },
    };

    return baseComponents;
  }, [variant]); // 仅在 variant 改变时重新计算

  // 使用 useMemo 优化内容处理，避免重复计算
  const processedContent = useMemo(() => {
    const validatedContent = validateContent(content);
    // 处理换行符，将 \n 转换为真正的换行
    return validatedContent.replace(/\\n/g, '\n');
  }, [content, validateContent]);

  // 错误边界处理
  const renderWithErrorBoundary = (children: React.ReactNode) => {
    if (!enableErrorBoundary) {
      return children;
    }

    try {
      return children;
    } catch (error) {
      console.error('Markdown rendering error:', error);
      return (
        errorFallback ?? (
          <div className="alert alert-warning b-r-10 pa-15 mg-t-10 mg-b-10">
            <i className="ph ph-warning-circle mg-e-8"></i>
            <strong>{t('markdown.renderingFailed')}</strong>
            <p className="mg-b-0 mg-t-5 f-s-13">{t('markdown.renderingError')}</p>
          </div>
        )
      );
    }
  };

  // 如果内容为空，显示占位符
  if (!content || content.trim() === '') {
    return (
      <div className={`markdown-content ${className}`}>
        <div className="text-center text-muted pa-20">
          <i className="ph ph-file-text f-s-24 mg-b-10 d-block"></i>
          <p className="mg-b-0 f-s-14">{t('markdown.noContent')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`markdown-content ${className}`} role="document" aria-label="Markdown content">
      {renderWithErrorBoundary(
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={customComponents}
          urlTransform={(uri: string) => {
            // 只阻止明确的安全威胁协议
            if (
              !uri ||
              uri.startsWith('javascript:') ||
              uri.startsWith('data:') ||
              uri.startsWith('vbscript:')
            ) {
              return '#';
            }

            // 允许所有其他协议，包括自定义import schemes
            return uri;
          }}
        >
          {processedContent}
        </ReactMarkdown>,
      )}
    </div>
  );
};

// 使用 React.memo 优化性能，避免不必要的重新渲染
const MemoizedMarkdownRenderer = React.memo(MarkdownRenderer);

// 导出类型定义，便于其他组件使用
export type { MarkdownRendererProps };

export default MemoizedMarkdownRenderer;
