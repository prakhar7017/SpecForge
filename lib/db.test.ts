import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "./db";
import { maintainSpecLimit } from "./db";

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(() => ({
    spec: {
      count: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  })),
}));

describe("maintainSpecLimit", () => {
  it("should delete oldest specs when count exceeds 5", async () => {
    vi.mocked(prisma.spec.count).mockResolvedValue(7);
    vi.mocked(prisma.spec.findMany).mockResolvedValue([
      { id: "1" },
      { id: "2" },
    ] as any);
    vi.mocked(prisma.spec.deleteMany).mockResolvedValue({ count: 2 } as any);

    await maintainSpecLimit();

    expect(prisma.spec.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["1", "2"] } },
    });
  });

  it("should not delete when count is 5 or less", async () => {
    vi.mocked(prisma.spec.count).mockResolvedValue(5);
    vi.mocked(prisma.spec.findMany).mockResolvedValue([]);
    vi.mocked(prisma.spec.deleteMany).mockResolvedValue({ count: 0 } as any);

    await maintainSpecLimit();

    expect(prisma.spec.deleteMany).not.toHaveBeenCalled();
  });
});