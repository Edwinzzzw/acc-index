import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function AboutPage() {
  useEffect(() => {
    document.title = '简介 · ACC 指数';
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <article className="prose prose-neutral max-w-none">
        <p className="text-xs uppercase tracking-widest text-rose-600">Manifesto · 宣言</p>
        <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-neutral-900 sm:text-5xl">
          废除 QS。
          <br />
          拥抱 ACC。
        </h1>

        <Section>
          <p>
            QS、US News、THE 等传统排名过于关注科研产出和雇主声誉，
            <strong>脱离了研究生的实际生存状态</strong>。
            它们告诉你某所学校的诺奖得主有多少，却不告诉你研一下学期还有几节早八。
          </p>
        </Section>

        <Section title="核心指标">
          <p>
            <strong>研究生平均结课早晚指数</strong>（Average Coursework Cycle，简称 ACC
            Index）衡量各高校授课型研究生完成所有必修/选修理论课程所需的时间跨度。
          </p>
          <p>
            评判逻辑只有一条：
            <em>结课越早，学校越好；结课越晚，学校越拉垮。</em>
          </p>
          <p>
            因为尽早结课意味着学生能尽早摆脱日常排课、早起打卡的束缚，获得整块的自由时间——
            投入到全职科研、毕业论文、实习、秋招/春招准备等真正高价值的活动中。
          </p>
        </Section>

        <Section title="评级标准">
          <p>以秋季入学为基准时间：</p>
          <Tier
            color="bg-rose-500"
            label="T0 夯爆了"
            range="次年 1–2 月结课"
            desc="神仙学校。极度硬核，开学即冲刺，春季直接放飞。学生拥有完美的实习与科研时间差。"
          />
          <Tier
            color="bg-amber-500"
            label="T1 顶级"
            range="次年 3–4 月结课"
            desc="主流中的优秀代表。结课早，能完美衔接暑期实习和春招。"
          />
          <Tier
            color="bg-blue-500"
            label="T2 人上人"
            range="次年 5 月结课"
            desc="中规中矩，时间安排略显拖沓，但还能抢救一下。"
          />
          <Tier
            color="bg-neutral-500"
            label="T3 NPC"
            range="次年 6 月或更晚"
            desc="战线拉得极长。研一下还在赶 pre 和小组作业的时候，T0 同学的 SCI 已经收到 reviewer comments 了。"
          />
        </Section>

        <Section title="它不是什么">
          <ul>
            <li>不是择校建议。它是一个项目维护者的主观指标。</li>
            <li>不是对任何学校的攻击。它是对「学制设计」的评价。</li>
            <li>
              不是科研产出排名。一所 T3 学校完全可能盛产 Nature 一作，只是它的研究生需要边上早八边写 Nature。
            </li>
          </ul>
        </Section>

        <Section title="想贡献数据？">
          <p>
            ACC 数据基于学校公开的 academic calendar 推算，与具体项目的真实课表存在偏差。
            如果你是某校在读研究生、知道你项目的真实结课时间，欢迎到 GitHub 仓库提 PR。
          </p>
          <p className="text-sm">
            <a
              href="https://github.com/Edwinzzzw/acc-index"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              github.com/Edwinzzzw/acc-index ↗
            </a>
          </p>
        </Section>

        <div className="mt-10 rounded-2xl bg-rose-50 p-6 text-center">
          <p className="text-sm text-neutral-700">想知道某所学校的 ACC 等级？</p>
          <Link
            to="/"
            className="mt-3 inline-block rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            前往搜索 →
          </Link>
        </div>
      </article>
    </div>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      {title && <h2 className="text-xl font-bold text-neutral-900">{title}</h2>}
      <div className="mt-3 space-y-3 text-base leading-relaxed text-neutral-700">{children}</div>
    </section>
  );
}

function Tier({
  color,
  label,
  range,
  desc,
}: {
  color: string;
  label: string;
  range: string;
  desc: string;
}) {
  return (
    <div className="my-3 flex gap-3 rounded-lg bg-neutral-50 p-3">
      <span
        className={`mt-0.5 inline-flex h-fit shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${color}`}
      >
        {label}
      </span>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-neutral-800">{range}</div>
        <div className="text-sm text-neutral-600">{desc}</div>
      </div>
    </div>
  );
}
