import React from "react";
import { groq } from "next-sanity";
import Image from "next/image";
import urlFor, { sanityClient } from "@/sanity";
import { PortableText } from "@portabletext/react";
import { RichTextComponents } from "@/components/RichTextComponents";
import Navbar from "@/components/Navbar";

import { Metadata } from "next";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const query = groq`
  *[_type == "post" && slug.current == $slug][0]{
    title,
    
  }
  `;
  const metadata = await sanityClient.fetch(query, { slug });

  return {
    title: "Blog | " + metadata.title,
  };
}

// revalidate after one day
// export const revalidate = 2628000; // revalidate the data at most every month
/**
 * This function generates an array of static parameters for all posts in a Sanity.io dataset.
 * @returns an array of objects, where each object has a single property "slug" with a value
 * corresponding to a slug retrieved from a Sanity.io dataset. The slugs are retrieved using a GROQ
 * query and mapped to an array of strings before being mapped again to an array of objects with the
 * "slug" property.
 */
export async function generateStaticParams() {
  const query = groq`*[_type == 'post']{
    slug
}`;

  const slugs: Post[] = await sanityClient.fetch(query);

  const slugRoutes = slugs.map((slug) => slug.slug.current);

  return slugRoutes.map((slug) => ({
    slug,
  }));
}

async function Post({ params: { slug } }: Props) {
  const query = groq`
   *[_type=="post" && slug.current == $slug][0]{
author->{
name,
  image,
  bio,
},
        categories[]->{
          title,
        },
title,
description,
slug,
mainImage,
body,
_id,
_createdAt,
_rev,
_type,
_updatedAt,

    }
  `;
  const post: Post = await sanityClient.fetch(query, { slug });
  // console.log(post.githubLink);

  return (
    <>
      <article className="px-5 my-10 max-w-[1000px] mx-auto w-full pb-28">
        <section>
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.title}
            width={1600}
            height={1600}
          />

          <section>
            <h1 className="text-3xl mt-10 mb-3 font-bold "> {post.title}</h1>
            <p>{post.description}</p>

            <p className="text-sm mt-1 font-normal ">
              Finished:{" "}
              {new Date(post._createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="flex items-center justify-start mt-auto space-x-2">
              {post.categories?.map((tag: any, i: any) => (
                <p
                  className="bg-muted-foreground/50 px-3 py-1 rounded-full text-sm font-semibold mt-4"
                  key={i}
                >
                  {tag.title}
                </p>
              ))}
            </div>
          </section>
        </section>

        <article className="my-10">
          <PortableText value={post.body} components={RichTextComponents} />
        </article>

        <hr className="border-secondary-foreground border" />
      </article>
    </>
  );
}

export default Post;
